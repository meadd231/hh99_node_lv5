class AppError extends Error {
  constructor(errorCode, errorMessage) {
      super();
      this.errorCode = errorCode;
      this.errorMessage = errorMessage;
  }
}
module.exports = AppError;