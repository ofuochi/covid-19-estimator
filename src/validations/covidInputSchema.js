const Joi = require('@hapi/joi');

const schema = Joi.object({
  periodType: Joi.string().valid('days', 'weeks', 'months').required(),
  timeToElapse: Joi.number().required(),
  reportedCases: Joi.number().required(),
  population: Joi.number().required(),
  totalHospitalBeds: Joi.number().required(),
  region: Joi.object({
    name: Joi.string().required(),
    avgAge: Joi.number().required(),
    avgDailyIncomeInUSD: Joi.number().required(),
    avgDailyIncomePopulation: Joi.number().required()
  })
});

module.exports = schema;
