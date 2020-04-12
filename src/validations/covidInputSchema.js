const Joi = require('@hapi/joi');

const schema = Joi.object({
  periodType: Joi.string().valid('days', 'weeks', 'months').required(),
  timeToElapse: Joi.number().integer().min(1).required(),
  reportedCases: Joi.number().integer().min(0).required(),
  population: Joi.number().integer().min(0).required(),
  totalHospitalBeds: Joi.number().integer().required(),
  region: Joi.object({
    name: Joi.string().required(),
    avgAge: Joi.number().min(0).required(),
    avgDailyIncomeInUSD: Joi.number().min(0).required(),
    avgDailyIncomePopulation: Joi.number().min(0).required()
  })
});

module.exports = schema;
