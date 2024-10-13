import CustomAPIError, { ErrorCode } from './custom.error.js';

class NotFoundError extends CustomAPIError {
  override statusCode: number;
  constructor(message: string, errorCode: ErrorCode) {
    super(message, errorCode, 404, null);
    this.statusCode = 404;
  }
}

export default NotFoundError;
