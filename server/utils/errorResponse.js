class ErrorResponse extends Error {

  constructor(message, statusCode) {
    // Call the parent constructor (Error) with the message
    super(message);
    // Add the statusCode property to this instance
    this.statusCode = statusCode;
  }
}

module.exports = ErrorResponse;