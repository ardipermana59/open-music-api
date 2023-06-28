const Joi = require('joi');

const Album_PayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().min(1900).max(new Date().getFullYear()).required(),
});
module.exports = { Album_PayloadSchema };
