const InvariantErrorException = require(
    '../../exceptions/InvariantErrorException',
);
const {
  PlaylistPayloadSchema,
  AddSongPlaylistSchema,
  DeleteSongPlaylistSchema,
} = require('./schema');

const PlaylistValidator = {
  validatePlaylistPayload: (payload) => {
    const result = PlaylistPayloadSchema.validate(payload);
    if (result.error) {
      throw new InvariantErrorException(result.error.message);
    }
  },
  validateAddSongPlaylistPayload: (payload) => {
    const result = AddSongPlaylistSchema.validate(payload);
    if (result.error) {
      throw new InvariantErrorException(result.error.message);
    }
  },
  validateDeleteSongPlaylistPayload: (payload) => {
    const result = DeleteSongPlaylistSchema.validate(payload);
    if (result.error) {
      throw new InvariantErrorException(result.error.message);
    }
  },
};

module.exports = PlaylistValidator;
