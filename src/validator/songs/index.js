const InvariantErrorException = require(
    '../../exceptions/InvariantErrorException',
);
const {SongPayloadSchema} = require('./schema');

const SongValidator = {
  validateSongPayload: (payload) => {
    const result = SongPayloadSchema.validate(payload);
    if (result.error) {
      throw new InvariantErrorException(result.error.message);
    }
  },
};

module.exports = SongValidator;
