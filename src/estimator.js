const computeFactor = (periodType, timeToElapse) => {
  switch (periodType) {
    case 'days':
      return Math.floor(timeToElapse / 3);
    case 'weeks':
      return Math.floor((timeToElapse * 7) / 3);
    default:
      // Assume 30 days in a month
      return Math.floor((timeToElapse * 30) / 3);
  }
};

const covid19ImpactEstimator = data => {
  const { reportedCases } = data;
  const impactCurrentlyInfected = reportedCases * 10;
  const severeImpactCurrentlyInfected = reportedCases * 50;

  const factor = computeFactor(data.periodType, data.timeToElapse);
  const impactInfectionsByRequestedTime =
    impactCurrentlyInfected * Math.pow(2, factor);
  const severImpactInfectionsByRequestedTime =
    severeImpactCurrentlyInfected * Math.pow(2, factor);

  return {
    data,
    impact: {
      currentlyInfected: impactCurrentlyInfected,
      infectionsByRequestedTime: impactInfectionsByRequestedTime
    },
    severeImpact: {
      currentlyInfected: severeImpactCurrentlyInfected,
      infectionsByRequestedTime: severImpactInfectionsByRequestedTime
    }
  };
};
export default covid19ImpactEstimator;
