const InvariantErrorException = require(
    '../../exceptions/InvariantErrorException',
);
const {UserPayloadSchema} = require('./schema');

const UserValidator = {
  validateUserPayload: (payload) => {
    const result = UserPayloadSchema.validate(payload);
    if (result.error) {
      throw new InvariantErrorException(result.error.message);
    }
  },
};

module.exports = UserValidator;
