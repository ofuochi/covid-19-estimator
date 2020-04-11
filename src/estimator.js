import EstimationOutput from './estimationOutput';

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
  toDays(periodType, timeToElapse) / 3;

const covid19ImpactEstimator = (data) => {
  const r = new EstimationOutput();
  r.data = data;

  const {
    reportedCases,
    totalHospitalBeds,
    periodType,
    timeToElapse,
    region
  } = data;

  const factor = computeFactor(periodType, timeToElapse);
  const hospitalBedsPercentage = (35 / 100) * totalHospitalBeds;
  const incomePerDay =
    (region.avgDailyIncomeInUSD * region.avgDailyIncomePopulation) /
    toDays(periodType, timeToElapse);

  // Mild Impact
  r.impact.currentlyInfected = reportedCases * 10;
  r.impact.infectionsByRequestedTime = Math.trunc(
    r.impact.currentlyInfected * Math.pow(2, factor)
  );
  r.impact.severeCasesByRequestedTime = Math.trunc(
    (15 / 100) * r.impact.infectionsByRequestedTime
  );
  r.impact.hospitalBedsByRequestedTime = Math.trunc(
    hospitalBedsPercentage * r.impact.severeCasesByRequestedTime
  );
  r.impact.casesForICUByRequestedTime = Math.trunc(
    (5 / 100) * r.impact.infectionsByRequestedTime
  );
  r.impact.casesForVentilatorsByRequestedTime = Math.trunc(
    (2 / 100) * r.impact.infectionsByRequestedTime
  );
  r.impact.dollarsInFlight = Math.trunc(
    r.impact.infectionsByRequestedTime * incomePerDay
  );

  // Severe Impact
  r.severeImpact.currentlyInfected = reportedCases * 50;
  r.severeImpact.infectionsByRequestedTime = Math.trunc(
    r.severeImpact.currentlyInfected * Math.pow(2, factor)
  );
  r.severeImpact.severeCasesByRequestedTime = Math.trunc(
    (15 / 100) * r.severeImpact.infectionsByRequestedTime
  );
  r.severeImpact.hospitalBedsByRequestedTime = Math.trunc(
    hospitalBedsPercentage * r.severeImpact.severeCasesByRequestedTime
  );
  r.severeImpact.casesForICUByRequestedTime = Math.trunc(
    (5 / 100) * r.severeImpact.infectionsByRequestedTime
  );
  r.severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(
    (2 / 100) * r.severeImpact.infectionsByRequestedTime
  );
  r.severeImpact.dollarsInFlight = Math.trunc(
    r.severeImpact.infectionsByRequestedTime * incomePerDay
  );

  return r;
};
export default covid19ImpactEstimator;
