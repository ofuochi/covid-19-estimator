/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable operator-linebreak */
const EstimationOutput = require('./output');

const toDays = (periodType, timeToElapse) => {
  switch (periodType) {
    case 'days':
      return timeToElapse;
    case 'weeks':
      return timeToElapse * 7;
    default:
      // Assume 30 days in a month
      return timeToElapse * 30;
  }
};

const computeFactor = (periodType, timeToElapse) =>
  Math.floor(toDays(periodType, timeToElapse) / 3);

const covid19ImpactEstimator = (data) => {
  const {
    reportedCases,
    totalHospitalBeds,
    periodType,
    timeToElapse,
    region
  } = data;
  const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = region;
  const factor = computeFactor(periodType, timeToElapse);
  const availableHospitalBeds = Math.floor((35 / 100) * totalHospitalBeds);
  const incomePerDay =
    (avgDailyIncomeInUSD * avgDailyIncomePopulation) /
    toDays(periodType, timeToElapse);

  const output = new EstimationOutput();
  output.data = data;

  // Mild Impact
  output.impact.currentlyInfected = reportedCases * 10;
  output.impact.infectionsByRequestedTime =
    output.impact.currentlyInfected * 2 ** factor;

  output.impact.severeCasesByRequestedTime = Math.floor(
    (15 / 100) * output.impact.infectionsByRequestedTime
  );
  output.impact.hospitalBedsByRequestedTime =
    availableHospitalBeds - output.impact.severeCasesByRequestedTime;

  output.impact.casesForICUByRequestedTime = Math.floor(
    (5 / 100) * output.impact.infectionsByRequestedTime
  );
  output.impact.casesForVentilatorsByRequestedTime = Math.floor(
    (2 / 100) * output.impact.infectionsByRequestedTime
  );
  output.impact.dollarsInFlight = Math.floor(
    output.impact.infectionsByRequestedTime * incomePerDay
  );

  // Severe Impact
  output.severeImpact.currentlyInfected = reportedCases * 50;
  output.severeImpact.infectionsByRequestedTime =
    output.severeImpact.currentlyInfected * 2 ** factor;

  output.severeImpact.severeCasesByRequestedTime = Math.floor(
    (15 / 100) * output.severeImpact.infectionsByRequestedTime
  );
  output.severeImpact.hospitalBedsByRequestedTime =
    availableHospitalBeds - output.severeImpact.severeCasesByRequestedTime;

  output.severeImpact.casesForICUByRequestedTime = Math.floor(
    (5 / 100) * output.severeImpact.infectionsByRequestedTime
  );
  output.severeImpact.casesForVentilatorsByRequestedTime = Math.floor(
    (2 / 100) * output.severeImpact.infectionsByRequestedTime
  );
  output.severeImpact.dollarsInFlight = Math.floor(
    output.severeImpact.infectionsByRequestedTime * incomePerDay
  );

  return output;
};
module.exports = covid19ImpactEstimator;
