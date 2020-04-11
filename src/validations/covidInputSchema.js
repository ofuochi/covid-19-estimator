const Joi = require('@hapi/joi');

const schema = Joi.object({
  periodType: Joi.string().valid('days', 'weeks', 'months').required(),
  timeToElapse: Joi.number().integer().required(),
  reportedCases: Joi.number().integer().required(),
  population: Joi.number().integer().required(),
  totalHospitalBeds: Joi.number().integer().required(),
  region: Joi.object({
    name: Joi.string().required(),
    avgAge: Joi.number().required(),
    avgDailyIncomeInUSD: Joi.number().required(),
    avgDailyIncomePopulation: Joi.number().required()
  })
});

module.exports = schema;
