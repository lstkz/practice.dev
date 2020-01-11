/* tslint:disable:no-console */
import chalk from 'chalk';
import { SocketMessage, TestInfo } from 'shared';
import { Notifier } from './types';

export class ConsoleNotifier implements Notifier {
  private tests: TestInfo[] | null = null;

  private getTest(id: number) {
    return this.tests!.find(x => x.id === id)!;
  }
  private getStep(testId: number, stepId: number) {
    return this.getTest(testId).steps.find(x => x.id === stepId)!;
  }

  async flush() {
    //
  }

  async notify(action: SocketMessage) {
    switch (action.type) {
      case 'TEST_INFO': {
        this.tests = action.payload.tests;
        break;
      }
      case 'RESULT': {
        console.log(action.payload.success ? 'PASS' : 'FAIL');
        break;
      }
      case 'STARTING_TEST': {
        const test = this.getTest(action.payload.testId);
        console.log(` Test ${test.id}: ${test.name}`);
        break;
      }
      case 'STEP_PASS': {
        const step = this.getStep(action.payload.testId, action.payload.stepId);
        console.log(chalk.green('    ✓ ') + chalk.gray(step.name));
        break;
      }
      case 'STEP_FAIL': {
        const step = this.getStep(action.payload.testId, action.payload.stepId);
        console.log(chalk.red('    ✕ ') + chalk.gray(step.name));
        console.error('  ' + chalk.red(action.payload.error));
        break;
      }
    }
  }
}
