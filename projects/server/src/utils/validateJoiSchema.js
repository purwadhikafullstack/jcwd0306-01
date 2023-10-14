const { ResponseError } = require('../errors');

function validateJoiSchema(value, schema) {
  const result = schema.validate(value);
  if (result.error) throw new ResponseError(result.error?.message, 400);
}

module.exports = validateJoiSchema;
