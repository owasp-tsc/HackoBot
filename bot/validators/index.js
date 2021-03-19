const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

exports.validateMongooseId = (id) => {
  return Joi.objectId().validate(id);
};
exports.validateEmail = (email) => {
  return Joi.string().email().validate(email);
};
