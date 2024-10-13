import CustomAPIError, { ErrorCode } from './custom.error.js';

class ForbiddenError extends CustomAPIError {
  override statusCode: number;
  constructor(message: string, errorCode: ErrorCode) {
    super(message, errorCode, 403, null);
    this.statusCode = 403;
  }
}

export default ForbiddenError;
