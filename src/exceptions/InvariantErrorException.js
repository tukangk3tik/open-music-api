const ClientError = require('./ClientError');

class InvariantErrorException extends ClientError {
  constructor(message) {
    super(message);
    this.name = 'InvariantErrorException';
  }
}

module.exports = InvariantErrorException;
