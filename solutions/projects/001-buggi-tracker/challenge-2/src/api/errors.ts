export class HttpError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}
export class NotFoundError extends HttpError {
  constructor(message: string) {
    super(404, message);
  }
}
export class BadRequestError extends HttpError {
  constructor(message: string, public params?: any) {
    super(400, message);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string) {
    super(401, message);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message: string) {
    super(403, message);
  }
}