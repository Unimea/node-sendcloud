const Joi = require('joi');
const crypto = require('crypto');

const SCHEMA = {
  apiUser: Joi.string(),
  apiKey: Joi.string(),
  templateId: Joi.number(),
  from: Joi.string().email().label('Email where from'),
  subject: Joi.string(),
  to: Joi.string().email(),
};

const SCHEMAX = {
  apiUser: Joi.string().required(),
  apiKey: Joi.string().required(),
  templateId: Joi.number().required(),
  from: Joi.string().email().label('Email where from').required(),
  subject: Joi.string().required(),
  to: Joi.string().email().required(),
};

function validate(params, schema) {
  return new Promise((resolve, reject) => {
    Joi.validate(params, schema, {}, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function assert(params, list, isRequired) {
  list.forEach(s => {
    Joi.assert(params[s], isRequired ? SCHEMAX[s] : SCHEMA[s]);
  });
}

function md5(str) {
  return crypto.createHash('md5').update(new Buffer(str)).digest('hex');
};

module.exports = {
  SCHEMA,
  validate,
  assert,
  md5,
};
