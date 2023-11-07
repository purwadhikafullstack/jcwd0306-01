const findTheSmallestDuration = (result, destination) => {
  const { destinationIndex } = result
    .filter((val) => val.condition === 'ROUTE_EXISTS')
    .sort((a, b) => parseInt(a.duration, 10) - parseInt(b.duration, 10))[0];

  return destination[destinationIndex];
};

module.exports = { findTheSmallestDuration };
