const ClientError = require('./ClientError');
const httpStatusCode = require('../utils/http/status_code');

class NotFoundException extends ClientError {
  constructor(message) {
    super(message, httpStatusCode.notFound);
    this.name = 'NotFoundException';
  }
}

module.exports = NotFoundException;
