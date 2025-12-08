export class AppError extends Error {
  constructor(code, details = null) {
    super(code);
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this);
  }
}
