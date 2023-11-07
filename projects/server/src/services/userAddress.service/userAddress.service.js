const { createClient } = require('redis');
const Service = require('../baseServices');
const db = require('../../models');
const { ResponseError } = require('../../errors');
const { GmapsOptionSetter } = require('./GmapsOptionSetter');
const { findTheSmallestDuration } = require('./findTheSmallestDuration');
const { getWarehouseAddress } = require('./getWarehouseAddress');
const { fetchRajaOngkir } = require('./fetchRajaOngkir');

const client = createClient({
  url: 'redis://localhost:6379',
  legacyMode: true,
});
client.on(`error`, () => client.disconnect());

class UserAddress extends Service {
  optionGetAddressByUserId = {
    include: [
      { model: db.Province, attributes: ['name'] },
      { model: db.City, attributes: ['name'] },
    ],
    logging: false,
  };

  GOOGLEMAPS_API_KEY = process.env.Googlemaps_api_key;

  getAddressByUserId = (req) =>
    this.getByUserId(req, this.optionGetAddressByUserId);

  getShippingOptionsWithRedis = async (req, res) => {
    try {
      if (!client.isOpen) client.connect();
      const key = JSON.stringify(req.body.postalCode);
      client.get(key, async (err, result) => {
        if (err) {
          const paymentOption = await this.getShippingOptions(req);
          return res.send(paymentOption);
        }
        if (result) return res.send(JSON.parse(result));
        const paymentOption = await this.getShippingOptions(req);
        client.setEx(key, 3000, JSON.stringify(paymentOption));
        return res.send(paymentOption);
      });
    } catch (error) {
      client.disconnect();
      if (error.code === `ECONNREFUSED`) {
        const paymentOption = await this.getShippingOptions(req);
        return res.send(paymentOption);
      }
      throw new ResponseError(error?.message, error?.statusCode);
    }
  };

  getShippingOptions = async (req) => {
    try {
      const destination = await getWarehouseAddress();
      const warehouse = await this.findNearestWareHouse(req, destination);
      const body = {
        origin: warehouse.cityId,
        warehouseId: warehouse.warehouseId,
        destination: req.body.cityId,
        weight: req.body.weight,
      };
      const paymentOption = await fetchRajaOngkir(body);
      return paymentOption;
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

  findNearestWareHouse = async (req, destination) => {
    const route = `https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix?`;
    const key = `key=${this.GOOGLEMAPS_API_KEY}`;
    const fields = `&fields=originIndex,destinationIndex,condition,distanceMeters,duration`;
    const body = await GmapsOptionSetter([req.body], destination);
    const response = await fetch(route + key + fields, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    const result = await response.json();
    return findTheSmallestDuration(result, destination);
  };
}

module.exports = new UserAddress('UserAddress');
