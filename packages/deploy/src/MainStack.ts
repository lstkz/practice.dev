import cdk = require('@aws-cdk/core');
import { Socket } from './resources/Socket';
import { MainTable } from './resources/MainTable';
import { WebSiteDist } from './resources/WebSiteDist';
import { ApiLambda } from './resources/ApiLambda';
import { TesterLambda } from './resources/TesterLambda';
import { MainTopic } from './resources/MainTopic';
import { TesterTopic } from './resources/TesterTopic';
import { MainBucket } from './resources/MainBucket';
import { LogLambda } from './resources/LogLambda';

if (!process.env.STACK_NAME) {
  throw new Error('STACK_NAME is not set');
}

export class MainStack extends cdk.Stack {
  constructor(app: cdk.App, id: string) {
    super(app, id);
  }
  async create() {
    const initOnly = process.env.INIT_STACK === '1';

    const mainTopic = new MainTopic(this);
    const testerTopic = new TesterTopic(this);
    const mainBucket = new MainBucket(this);
    const mainTable = new MainTable(this);
    const apiLambda = new ApiLambda(this, initOnly, {
      mainTopic,
      testerTopic,
      mainBucket,
      mainTable,
    });
    const testerLambda = new TesterLambda(this, initOnly, {
      mainTopic,
      testerTopic,
      mainBucket,
      mainTable,
    });
    if (process.env.REPORT_ERROR_EMAIL) {
      new LogLambda(this, initOnly, {
        apiLambda,
        testerLambda,
        mainTopic,
        testerTopic,
        mainBucket,
        mainTable,
      });
    }
    new Socket(this, { apiLambda });
    new WebSiteDist(this, initOnly, {
      mainBucket,
    });
  }
}

(async function () {
  const app = new cdk.App();
  const stack = new MainStack(app, process.env.STACK_NAME!);
  await stack.create();

  app.synth();
})().catch(e => {
  console.error(e);
  process.exit(1);
});
