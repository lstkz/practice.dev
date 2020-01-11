import { SocketMessage, TestInfo } from './types';

interface TestResultState {
  tests: TestInfo[];
  result: 'PASS' | 'FAIL';
}

export function updateTestResult<T extends TestResultState>(
  state: T,
  msg: SocketMessage
) {
  const getTest = (id: number) => state.tests.find(x => x.id === id)!;
  const getStep = (testId: number, stepId: number) =>
    getTest(testId).steps.find(x => x.id === stepId)!;

  switch (msg.type) {
    case 'TEST_INFO': {
      state.tests = msg.payload.tests;
      break;
    }
    case 'STARTING_TEST': {
      const { testId } = msg.payload;
      getTest(testId).result = 'running';
      break;
    }
    case 'STARTING_STEP': {
      const { testId, stepId } = msg.payload;
      getStep(testId, stepId).result = 'running';
      break;
    }
    case 'STEP_FAIL': {
      const { testId, stepId, error } = msg.payload;
      const step = getStep(testId, stepId);
      step.result = 'fail';
      step.error = error;
      break;
    }
    case 'STEP_PASS': {
      const { testId, stepId } = msg.payload;
      const step = getStep(testId, stepId);
      step.result = 'pass';
      break;
    }
    case 'TEST_FAIL': {
      const { testId } = msg.payload;
      getTest(testId).result = 'fail';
      break;
    }
    case 'TEST_PASS': {
      const { testId } = msg.payload;
      getTest(testId).result = 'pass';
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
        test.steps.forEach(step => {
          if (step.result === 'pending') {
            step.result = 'fail-skipped';
          }
        });
      });
      break;
    }
  }
}
