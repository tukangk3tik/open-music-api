const InvariantErrorException = require(
    '../../exceptions/InvariantErrorException',
);
const {AlbumPayloadSchema} = require('./schema');

const AlbumValidator = {
  validateAlbumPayload: (payload) => {
    const result = AlbumPayloadSchema.validate(payload);
    if (result.error) {
      throw new InvariantErrorException(result.error.message);
    }
  },
};

module.exports = AlbumValidator;
