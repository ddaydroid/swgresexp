const Joi = require('joi');

/**
 * Validate resource query parameters
 * @param {Object} query - Request query parameters
 * @returns {Object} - Validation result
 */
const validateResourceQuery = (query) => {
  const schema = Joi.object({
    name: Joi.string().trim().max(100),
    type: Joi.string().trim().max(100),
    planet: Joi.string().trim().max(50),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(50),
    min_dr: Joi.number().integer().min(0).max(1000),
    max_dr: Joi.number().integer().min(0).max(1000),
    min_ma: Joi.number().integer().min(0).max(1000),
    max_ma: Joi.number().integer().min(0).max(1000),
    min_oq: Joi.number().integer().min(0).max(1000),
    max_oq: Joi.number().integer().min(0).max(1000),
    min_sr: Joi.number().integer().min(0).max(1000),
    max_sr: Joi.number().integer().min(0).max(1000),
    min_ut: Joi.number().integer().min(0).max(1000),
    max_ut: Joi.number().integer().min(0).max(1000),
    min_fl: Joi.number().integer().min(0).max(1000),
    max_fl: Joi.number().integer().min(0).max(1000),
    min_pe: Joi.number().integer().min(0).max(1000),
    max_pe: Joi.number().integer().min(0).max(1000)
  }).unknown(false);

  return schema.validate(query);
};

/**
 * Validate schematic query parameters
 * @param {Object} query - Request query parameters
 * @returns {Object} - Validation result
 */
const validateSchematicQuery = (query) => {
  const schema = Joi.object({
    name: Joi.string().trim().max(100),
    category: Joi.string().trim().max(100),
    profession: Joi.string().trim().max(50),
    resource_type: Joi.string().trim().max(100),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(50)
  }).unknown(false);

  return schema.validate(query);
};

/**
 * Validate calculator request body
 * @param {Object} body - Request body
 * @returns {Object} - Validation result
 */
const validateCalculatorBody = (body) => {
  const schema = Joi.object({
    schematicId: Joi.number().integer().required(),
    experimentFocus: Joi.string().trim().max(100)
  }).unknown(false);

  return schema.validate(body);
};

module.exports = {
  validateResourceQuery,
  validateSchematicQuery,
  validateCalculatorBody
};
