import { FailureResponse, HttpError } from '@/infra';

/**
 * This module defines custom HTTP error classes for common HTTP status codes.
 * Each class extends the base HttpError class and sets a specific status code
 * and default message.
 */

/**
 * 400 Bad Request
 */
export class BadRequestError extends HttpError {
  constructor(failures: FailureResponse[]) {
    super(400, failures);
  }
}

/**
 * 401 Unauthorized
 */
export class UnauthorizedError extends HttpError {
  constructor(failures: FailureResponse[]) {
    super(401, failures);
  }
}

/**
 * 403 Forbidden
 */
export class ForbiddenError extends HttpError {
  constructor(failures: FailureResponse[]) {
    super(403, failures);
  }
}

/**
 * 404 Not Found
 */
export class NotFoundError extends HttpError {
  constructor(failures: FailureResponse[]) {
    super(404, failures);
  }
}

/**
 * 500 Internal Server Error
 */
export class InternalServerError extends HttpError {
  constructor(failures: FailureResponse[]) {
    super(500, failures);
  }
}
