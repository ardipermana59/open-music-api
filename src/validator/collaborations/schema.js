const Joi = require('joi');

const Collaboration_PayloadSchema = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});

module.exports = { Collaboration_PayloadSchema };
