import CustomAPIError, { ErrorCode } from './custom.error.js';

class InternalserverError extends CustomAPIError {
  override statusCode: number;
  constructor(message: string, errorCode: ErrorCode) {
    super(message, errorCode, 500, null);
    this.statusCode = 500;
  }
}

export default InternalserverError;
