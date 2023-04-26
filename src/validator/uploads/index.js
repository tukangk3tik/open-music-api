const InvariantErrorException = require(
    '../../exceptions/InvariantErrorException',
);
const {ImageHeaderSchema} = require('./schema');

const UploadsValidator = {
  validateImageHeader: (payload) => {
    const result = ImageHeaderSchema.validate(payload);
    if (result.error) {
      throw new InvariantErrorException(result.error.message);
    }
  },
};

module.exports = UploadsValidator;
