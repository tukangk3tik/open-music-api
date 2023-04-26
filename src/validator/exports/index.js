const InvariantErrorException = require(
    '../../exceptions/InvariantErrorException',
);
const {ExportPayloadSchema} = require('./schema');

const ExportValidator = {
  validateExportPayload: (payload) => {
    const result = ExportPayloadSchema.validate(payload);
    if (result.error) {
      throw new InvariantErrorException(result.error.message);
    }
  },
};

module.exports = ExportValidator;
