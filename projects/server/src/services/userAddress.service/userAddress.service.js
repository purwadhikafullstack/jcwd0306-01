const { createClient } = require('redis');
const Service = require('../baseServices');
const db = require('../../models');
const { ResponseError } = require('../../errors');

const client = createClient({
  url: 'redis://localhost:6379',
  legacyMode: true,
});

class UserAddress extends Service {
  optionGetAddressByUserId = {
    include: [
      { model: db.Province, attributes: ['name'] },
      { model: db.City, attributes: ['name'] },
    ],
    logging: false,
  };

  GOOGLEMAPS_API_KEY = process.env.Googlemaps_api_key;

  rajaOngkirHeader = {
    key: process.env.RajaOngkir_api_key,
    'content-type': 'application/json',
  };

  courier = ['jne', 'tiki', 'pos'];

  getAddressByUserId = (req) =>
    this.getByUserId(req, this.optionGetAddressByUserId);

  getShippingOptions = async (req, res) => {
    if (!client.isOpen) await client.connect();
    const key = JSON.stringify(req.body.postalCode);
    try {
      client.get(key, async (err, result) => {
        if (result) return res.send(JSON.parse(result));
        console.log(`Fetch from API`);
        const warehouse = await this.findNearestWareHouse(req);
        const body = {
          origin: warehouse.cityId,
          warehouseId: warehouse.warehouseId,
          destination: req.body.cityId,
          weight: req.body.weight,
        };
        const paymentOption = await this.fetchRajaOngkir(body);
        client.setEx(key, 3000, JSON.stringify(paymentOption));
        return res.send(paymentOption);
      });
    } catch (error) {
      throw new ResponseError(error?.message, error?.statusCode);
    }
  };

  setNewDefault = async (req) => {
    await this.db.update(
      { isDefault: false },
      { where: { userId: req.params.userId, isDefault: true }, logging: false }
    );
    await this.update(req);
  };

  findNearestWareHouse = async (req) => {
    const route = `https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix?`;
    const key = `key=${this.GOOGLEMAPS_API_KEY}`;
    const fields = `&fields=originIndex,destinationIndex,condition,distanceMeters,duration`;
    const destination = await UserAddress.getWarehouseAddress();
    const body = await UserAddress.optionGMAPSsetter([req.body], destination);
    const response = await fetch(route + key + fields, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    const result = await response.json();
    return UserAddress.findTheSmallestDuration(result, destination);
  };

  static findTheSmallestDuration = (result, destination) => {
    const { destinationIndex } = result
      .filter((val) => val.condition === 'ROUTE_EXISTS')
      .sort((a, b) => parseInt(a.duration, 10) - parseInt(b.duration, 10))[0];

    return destination[destinationIndex];
  };

  static destinationFormater = (
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

  static optionGMAPSsetter(
    origins = [{ latitude: 0, longitude: 0 }],
    destination = [{ latitude: 0, longitude: 0 }]
  ) {
    const formattedOrigin = UserAddress.destinationFormater(origins);
    const formatedDestination = UserAddress.destinationFormater(destination);
    return {
      origins: formattedOrigin,
      destinations: formatedDestination,
      travelMode: 'DRIVE',
      routingPreference: 'TRAFFIC_AWARE',
    };
  }

  static getWarehouseAddress = async () => {
    try {
      const result = await db.WarehouseAddress.findAll({ logging: false });
      const temp = [];
      for (let i = 0; i < result.length; i += 1) {
        temp.push(result[i].dataValues);
      }
      return temp;
    } catch (error) {
      throw new ResponseError(error?.message);
    }
  };

  fetchRajaOngkir = async (body) => {
    const temp = [];
    const data = {};
    for (let i = 0; i < this.courier.length; i += 1) {
      body.courier = this.courier[i];
      const response = await fetch(`https://api.rajaongkir.com/starter/cost`, {
        method: 'POST',
        headers: this.rajaOngkirHeader,
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (
        result.rajaongkir.status?.code > 300 ||
        result.rajaongkir.status?.code < 200
      )
        throw new ResponseError(result.rajaongkir.status?.description, 400);
      temp.push(result.rajaongkir?.results[0]);
      data.origin_details = result.rajaongkir.origin_details;
      data.destination_details = result.rajaongkir.destination_details;
    }
    data.origin_details.warehouseId = body.warehouseId;
    data.method = UserAddress.shippingMethodFormatter(temp);
    return data;
  };

  static shippingMethodFormatter = (arr = []) => {
    const temp = [];
    for (let i = 0; i < arr.length; i += 1) {
      for (let j = 0; j < arr[i].costs.length; j += 1) {
        temp.push({
          name:
            arr[i].code === `pos`
              ? arr[i].costs[j].service
              : `${arr[i].code} ${arr[i].costs[j].service}`,
          description: arr[i].costs[j].description,
          price: arr[i].costs[j].cost[0].value,
          etd: `${arr[i].costs[j].cost[0].etd.split(' ')[0]} day(s)`,
        });
      }
    }
    return temp.sort((a, b) => a.price - b.price);
  };
}

module.exports = new UserAddress('UserAddress');
