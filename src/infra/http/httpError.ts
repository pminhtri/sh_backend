export interface FailureResponse {
  errorCode: unknown;
  message: unknown;
  details?: Record<string, unknown>;
}

export class HttpError extends Error {
  public statusCode: number;
  public failures: FailureResponse[];

  constructor(statusCode: number, failures: FailureResponse[]) {
    super(failures.map((f) => (Array.isArray(f.message) ? f.message.join(', ') : f.message)).join('; '));
    this.statusCode = statusCode;
    this.failures = failures;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      failures: this.failures
    };
  }
}
