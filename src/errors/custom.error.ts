class CustomAPIError extends Error {
  override message: string;
  errorCode: ErrorCode;
  statusCode: number;
  error: unknown;
  constructor(
    message: string,
    errorCode: ErrorCode,
    statusCode: number,
    error: unknown,
  ) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.error = error;
  }
}

export enum ErrorCode {
  NOT_FOUND = 404,
  FORBIDDEN = 403,
  INTERNAL_SERVER = 500,
  BAD_REQUEST = 400,
}
export default CustomAPIError;
