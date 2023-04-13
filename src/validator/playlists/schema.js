const Joi = require('joi');

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const AddSongPlaylistSchema = Joi.object({
  songId: Joi.string().required(),
});

const DeleteSongPlaylistSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = {
  PlaylistPayloadSchema,
  AddSongPlaylistSchema,
  DeleteSongPlaylistSchema,
};
