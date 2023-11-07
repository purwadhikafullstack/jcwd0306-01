const db = require('../../models');
const {
  GmapsOptionSetter,
} = require('../userAddress.service/GmapsOptionSetter');

const sortResult = (nearbyWhse = [], destination = []) => {
  const sortedDestination = [];
  const sortedNearbyWhse = nearbyWhse
    .filter((val) => val.condition === 'ROUTE_EXISTS')
    .sort((a, b) => parseInt(a.duration, 10) - parseInt(b.duration, 10));
  sortedNearbyWhse.forEach((whs) => {
    sortedDestination.push(destination[whs.destinationIndex]);
  });
  return sortedDestination;
};

const destinationFormatter = (destination = []) => {
  const temp = [];
  destination.forEach((whs) =>
    temp.push(whs.Warehouse.WarehouseAddress.dataValues)
  );
  return temp;
};

const findClosestWarehouse = async (origin, destination) => {
  const formattedDestination = destinationFormatter(destination);
  const route = `https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix?`;
  const key = `key=${process.env.Googlemaps_api_key}`;
  const fields = `&fields=originIndex,destinationIndex,condition,distanceMeters,duration`;
  const body = await GmapsOptionSetter(origin, formattedDestination);
  const response = await fetch(route + key + fields, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  const nearbyWhse = await response.json();
  return sortResult(nearbyWhse, destination);
};

const findNearbyWarehouse = async (warehouseId = 0, warehouses = []) => {
  const { dataValues } = await db.WarehouseAddress.findOne({
    where: { warehouseId },
  });
  const nearbyWhse = await findClosestWarehouse([dataValues], warehouses);
  return nearbyWhse;
};

module.exports = { findNearbyWarehouse };
