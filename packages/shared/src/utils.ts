import { SocketMessage, TestInfo } from './types';

interface TestResultState {
  tests: TestInfo[];
  result: 'PASS' | 'FAIL' | null;
}

export function updateTestResult<T extends TestResultState>(
  state: T,
  msg: SocketMessage
) {
  const getTest = (id: number) => state.tests.find(x => x.id === id)!;

  switch (msg.type) {
    case 'TEST_INFO': {
      state.tests = msg.payload.tests.map(test => {
        if (test.id === 1) {
          return {
            ...test,
            result: 'running',
          };
        } else {
          return test;
        }
      });
      break;
    }
    case 'STARTING_TEST': {
      const { testId } = msg.payload;
      getTest(testId).result = 'running';
      break;
    }
    case 'TEST_FAIL': {
      const { testId } = msg.payload;
      const test = getTest(testId);
      test.result = 'fail';
      test.error = msg.payload.error;
      break;
    }
    case 'TEST_PASS': {
      const { testId } = msg.payload;
      const test = getTest(testId);
      const nextTest = getTest(testId + 1);
      test.result = 'pass';
      if (nextTest) {
        nextTest.result = 'running';
      }
      break;
    }
    case 'STEP': {
      const { testId } = msg.payload;
      const test = getTest(testId);
      if (!test.steps) {
        test.steps = [];
      }
      test.steps.push(msg.payload);
      break;
    }
    case 'RESULT': {
      state.result = msg.payload.success ? 'PASS' : 'FAIL';
      if (msg.payload.success) {
        break;
      }
      state.tests.forEach(test => {
        if (test.result === 'pending') {
          test.result = 'fail-skipped';
        }
      });
      break;
    }
  }
}
