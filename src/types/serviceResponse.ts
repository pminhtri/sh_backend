export interface ServiceResponse<TResult = unknown, TError extends ServiceError = ServiceError> {
  status: ServiceResponseStatus;
  result?: TResult;
  error?: TError;
}

export interface ServiceError<TReason = unknown, TPayload = unknown> {
  reason: TReason;
  message?: string | string[];
  payload?: TPayload;
}

export enum ServiceResponseStatus {
  Success = 'Success',
  Failed = 'Failed',
  ValidationFailed = 'ValidationFailed'
}
