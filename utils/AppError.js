// Extends the error class to have 
// a status field
class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

module.exports = AppError;
