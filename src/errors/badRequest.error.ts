import CustomAPIError, { ErrorCode } from './custom.error.js';

class BadRequestError extends CustomAPIError {
  override statusCode: number;
  constructor(message: string, errorCode: ErrorCode) {
    super(message, errorCode, 400, null);
    this.statusCode = 400;
  }
}

export default BadRequestError;
