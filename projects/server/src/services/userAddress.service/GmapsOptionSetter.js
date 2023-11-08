const destinationFormater = (
  arrayOfDestination = [{ latitude: 0, longitude: 0 }]
) => {
  const formattedDestination = [];
  for (let i = 0; i < arrayOfDestination.length; i += 1) {
    formattedDestination.push({
      waypoint: {
        location: {
          latLng: {
            longitude: arrayOfDestination[i].longitude,
            latitude: arrayOfDestination[i].latitude,
          },
        },
      },
    });
  }
  return formattedDestination;
};

function GmapsOptionSetter(
  origins = [{ latitude: 0, longitude: 0 }],
  destination = [{ latitude: 0, longitude: 0 }]
) {
  const formattedOrigin = destinationFormater(origins);
  const formatedDestination = destinationFormater(destination);
  return {
    origins: formattedOrigin,
    destinations: formatedDestination,
    travelMode: 'DRIVE',
    routingPreference: 'TRAFFIC_AWARE',
  };
}

module.exports = { GmapsOptionSetter };
