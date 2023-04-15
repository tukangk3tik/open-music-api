const Joi = require('joi');

const AddCollaborationPayloadSchema = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});

const DeleteCollaborationPayloadSchema = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});

module.exports = {
  AddCollaborationPayloadSchema,
  DeleteCollaborationPayloadSchema,
};
