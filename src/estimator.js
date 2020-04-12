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
  Math.trunc(toDays(periodType, timeToElapse) / 3);

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
  const availableHospitalBeds = (35 / 100) * totalHospitalBeds;
  const incomePerDay =
    (avgDailyIncomeInUSD * avgDailyIncomePopulation) /
    toDays(periodType, timeToElapse);

  const output = new EstimationOutput();
  output.data = data;

  // Mild Impact
  output.impact.currentlyInfected = reportedCases * 10;
  output.impact.infectionsByRequestedTime =
    output.impact.currentlyInfected * 2 ** factor;

  const impactSevereCasesByRequestedTime =
    (15 / 100) * output.impact.infectionsByRequestedTime;

  output.impact.severeCasesByRequestedTime = Math.trunc(
    impactSevereCasesByRequestedTime
  );
  output.impact.hospitalBedsByRequestedTime = Math.trunc(
    availableHospitalBeds - impactSevereCasesByRequestedTime
  );

  output.impact.casesForICUByRequestedTime = Math.trunc(
    (5 / 100) * output.impact.infectionsByRequestedTime
  );
  output.impact.casesForVentilatorsByRequestedTime = Math.trunc(
    (2 / 100) * output.impact.infectionsByRequestedTime
  );
  output.impact.dollarsInFlight = Math.trunc(
    output.impact.infectionsByRequestedTime * incomePerDay
  );

  // Severe Impact
  output.severeImpact.currentlyInfected = reportedCases * 50;
  output.severeImpact.infectionsByRequestedTime =
    output.severeImpact.currentlyInfected * 2 ** factor;

  const severeImpactSevereCasesByRequestedTime =
    (15 / 100) * output.severeImpact.infectionsByRequestedTime;
  output.severeImpact.severeCasesByRequestedTime = Math.trunc(
    severeImpactSevereCasesByRequestedTime
  );
  output.severeImpact.hospitalBedsByRequestedTime = Math.trunc(
    availableHospitalBeds - severeImpactSevereCasesByRequestedTime
  );

  output.severeImpact.casesForICUByRequestedTime = Math.trunc(
    (5 / 100) * output.severeImpact.infectionsByRequestedTime
  );
  output.severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(
    (2 / 100) * output.severeImpact.infectionsByRequestedTime
  );
  output.severeImpact.dollarsInFlight = Math.trunc(
    output.severeImpact.infectionsByRequestedTime * incomePerDay
  );

  return output;
};
module.exports = covid19ImpactEstimator;
