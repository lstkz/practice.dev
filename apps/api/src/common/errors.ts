export class AppError extends Error {
  // constructor(message: string) {
  //   super(message, 'APP_ERROR');
  //   Object.defineProperty(this, 'name', { value: 'AppError' });
  // }
}

export class UnreachableCaseError extends Error {
  constructor(val: never) {
    super(
      `Unreachable case: ${typeof val === 'string' ? val : JSON.stringify(val)}`
    );
  }
}
export class ElasticError extends Error {
  constructor(public details: any) {
    super(details.reason);
  }
}
