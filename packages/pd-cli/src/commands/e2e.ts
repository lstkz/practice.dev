import AWS from 'aws-sdk';
import AdmZip from 'adm-zip';
import Path from 'path';
import program from 'commander';
import { execSync } from 'child_process';
import chalk from 'chalk';
import mime from 'mime-types';
import fs from 'mz/fs';
import { getEnvSettings, walk, getAppRoot } from '../helper';
import { build } from './build';

const cf = new AWS.CloudFormation();
const lambda = new AWS.Lambda();
const s3 = new AWS.S3();
const e2eFrontDir = Path.join(__dirname, '../../../../e2e-tests/front');

export function getTests() {
  const noop = () => {};

  let names: string[] = [];
  const currentPrefix: string[] = [];

  // @ts-ignore
  global.it = global.test = (name, fn) => {
    names.push([...currentPrefix, name].join(' '));
  };

  // @ts-ignore
  global.describe = (name, fn) => {
    currentPrefix.push(name);
    fn();
    currentPrefix.pop();
  };

  // @ts-ignore
  global.before = noop;
  // @ts-ignore
  global.beforeEach = noop;
  // @ts-ignore
  global.afterEach = noop;
  // @ts-ignore
  global.after = noop;
  // @ts-ignore
  global.xit = noop;
  const fileNames = execSync('find src -name *.test.*', {
    cwd: e2eFrontDir,
  })
    .toString('utf8')
    .split('\n')
    .map(x => x.trim())
    .filter(x => x);

  return fileNames.map(fileName => {
    require(Path.join(e2eFrontDir, fileName));
    const testCases = names;
    names = [];
    return {
      fileName,
      testCases,
    };
  });
}

interface Stats {
  [x: string]: {
    total: number;
    passed: number;
    failed: number;
  };
}

interface AssertionResult {
  status: 'passed' | 'pending' | 'failed';
}
interface TestUnitResult {
  name: string;
  message: string;
  assertionResults: AssertionResult[];
}
interface TestResult {
  wrapper: number;
  cost: number;
  success: boolean;
  error: string;
  result: TestUnitResult[];
}

async function updateLambdaCode(testLambda: AWS.CloudFormation.StackResource) {
  const zip = new AdmZip();
  zip.addLocalFolder(Path.join(e2eFrontDir, 'src'), 'src');
  zip.addLocalFile(
    Path.join(__dirname, '../../../deploy/src/e2e-lambdas/test.js'),
    'src/lambda',
    'test.js'
  );
  zip.addLocalFile(Path.join(e2eFrontDir, 'package.json'));
  zip.addLocalFile(Path.join(e2eFrontDir, 'tsconfig.json'));

  await lambda
    .updateFunctionCode({
      FunctionName: testLambda.PhysicalResourceId!,
      ZipFile: zip.toBuffer(),
    })
    .promise();
}

async function runTests({
  fanoutLambda,
  testLambda,
  checkCost,
}: {
  testLambda: AWS.CloudFormation.StackResource;
  fanoutLambda: AWS.CloudFormation.StackResource;
  checkCost: boolean;
}) {
  const commandArgs: string[][] = [];

  const tests = getTests();
  tests.forEach(test => {
    test.testCases.forEach(testCase => {
      commandArgs.push([
        '-t',
        `^${testCase}$`,
        '--testPathPattern',
        `${test.fileName}$`,
      ]);
    });
  });

  console.time('start');
  const ret = await lambda
    .invoke({
      FunctionName: fanoutLambda.PhysicalResourceId + ':$LATEST',
      Payload: JSON.stringify({
        functionName: testLambda.PhysicalResourceId + ':$LATEST',
        tasks: commandArgs.map(args => ({ args })),
      }),
    })
    .promise();

  // fs.writeFileSync('./out.json', JSON.stringify(ret));
  console.timeEnd('start');
  if (ret.FunctionError) {
    console.log('--------------------------');
    console.log(ret.FunctionError);
    console.log(ret.Payload);
    process.exit(1);
  }
  const stats: Stats = {};
  const data: TestResult[] = JSON.parse(ret.Payload as string);

  let testCost = 0;
  let wrapperCost = 0;
  data.forEach(item => {
    if (item.wrapper) {
      wrapperCost += item.cost;
      return;
    }
    if (!item.success) {
      console.log(item.error);
      return;
    }
    if (!item.result) {
      return;
    }
    if (!Array.isArray(item.result)) {
      console.log(item.result);
      return;
    }
    testCost += item.cost;
    item.result.forEach(testResult => {
      const name = /\/(src\/.+)/.exec(testResult.name)![1];
      testResult.assertionResults.forEach(assertion => {
        if (assertion.status !== 'pending') {
          if (!stats[name]) {
            stats[name] = {
              failed: 0,
              passed: 0,
              total: 0,
            };
          }
          const testStats = stats[name];
          testStats.total++;
          if (assertion.status === 'passed') {
            testStats.passed++;
          } else if (assertion.status === 'failed') {
            console.error(testResult.message);
            testStats.failed++;
          } else {
            console.log('unknown status', assertion.status);
          }
        }
      });
    });
  });
  if (checkCost) {
    console.log(`cost wrapper: $${wrapperCost}`);
    console.log(`cost test: $${testCost}`);
    console.log(`cost total: $${testCost + wrapperCost}`);
  }
  let anyPass = false;
  let anyFail = false;
  Object.keys(stats).forEach(fileName => {
    const data = stats[fileName];
    console.log(chalk.white(fileName));
    console.log(`Total: ${data.total}`);
    console.log(chalk.green(`Passed: ${data.passed}`));
    console.log(chalk.red(`Failed: ${data.failed}`));
    if (data.failed) {
      anyFail = true;
    }
    if (data.passed) {
      anyPass = true;
    }
  });
  if (anyPass && !anyFail) {
    console.log(chalk.green(`OK`));
  } else {
    console.log(chalk.red(`FAIL`));
    process.exit(1);
  }
}

async function uploadS3(bucketName: string) {
  const frontRoot = getAppRoot('front');
  const buildDir = Path.join(frontRoot, 'build');
  const files = walk(buildDir);

  await Promise.all(
    files
      .filter(path => !path.endsWith('.DS_Store'))
      .map(async filePath => {
        const contentType = mime.lookup(filePath);
        if (!contentType) {
          throw new Error('no contentType for ' + filePath);
        }
        const file = Path.relative(buildDir, filePath);
        await s3
          .upload({
            Bucket: bucketName,
            Key: file.replace(/\\/g, '/'),
            Body: await fs.readFile(filePath),
            ContentType: contentType,
          })
          .promise();
      })
  );
}

export function init() {
  program
    .command('e2e')
    .option('--no-update', 'no update')
    .option('--check-cost', 'print cost info')
    .action(async ({ update, checkCost }) => {
      const env = getEnvSettings({});

      const resources = await cf
        .describeStackResources({
          StackName: env.E2E_STACK_NAME || process.env.E2E_STACK_NAME!,
        })
        .promise();
      const testLambda = resources.StackResources!.find(
        res =>
          res.LogicalResourceId.startsWith('test') &&
          res.ResourceType === 'AWS::Lambda::Function'
      );
      if (!testLambda) {
        throw new Error('Cannot find test lambda');
      }

      if (update) {
        await Promise.all([
          updateLambdaCode(testLambda),
          Promise.resolve().then(async () => {
            await build('front', {});
            await uploadS3(env.E2E_BUCKET_NAME);
          }),
        ]);
      }

      const fanoutLambda = resources.StackResources!.find(
        res =>
          res.LogicalResourceId.startsWith('fanout') &&
          res.ResourceType === 'AWS::Lambda::Function'
      );
      if (!fanoutLambda) {
        throw new Error('Cannot find fanout lambda');
      }
      await runTests({
        checkCost,
        fanoutLambda,
        testLambda,
      });
    });
}
