const InvariantErrorException = require(
    '../../exceptions/InvariantErrorException',
);
const {
  AddCollaborationPayloadSchema,
  DeleteCollaborationPayloadSchema,
} = require('./schema');

const CollaborationValidator = {
  validateAddCollaborationPayload: (payload) => {
    const result = AddCollaborationPayloadSchema.validate(payload);
    if (result.error) {
      throw new InvariantErrorException(result.error.message);
    }
  },
  validateDeleteCollaborationPayload: (payload) => {
    const result = DeleteCollaborationPayloadSchema.validate(payload);
    if (result.error) {
      throw new InvariantErrorException(result.error.message);
    }
  },
};

module.exports = CollaborationValidator;
