const { createClient } = require('redis');
const { default: fetch } = require('node-fetch');
const Service = require('../baseServices');
const { ResponseError } = require('../../errors');
const { GmapsOptionSetter } = require('./GmapsOptionSetter');
const { findTheSmallestDuration } = require('./findTheSmallestDuration');
const { getWarehouseAddress } = require('./getWarehouseAddress');
const { fetchRajaOngkir } = require('./fetchRajaOngkir');
const isActiveWarehouseNotChanging = require('./isActiveWarehouseNotChanging');
const optionGetAddressByUserId = require('./optionGetAddressByUserId');

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  legacyMode: true,
});
client.on(`error`, () => client.disconnect());

class UserAddress extends Service {
  GOOGLEMAPS_API_KEY = process.env.Googlemaps_api_key;

  getAddressByUserId = async (req) => {
    const { userId } = req.params;
    const { name } = req.query;
    const result = await this.getByUserId(
      req,
      optionGetAddressByUserId(name, userId)
    );
    return result;
  };

  getShippingOptionsWithRedis = async (req, res) => {
    try {
      const key = JSON.stringify(req.body.postalCode);
      if (!client.isOpen) await client.connect();
      client.get(key, async (err, result) => {
        const checkWarehouse = await isActiveWarehouseNotChanging(client);
        if (err) {
          const paymentOption = await this.getShippingOptions(req);
          return res.send(paymentOption);
        }
        if (result && checkWarehouse) return res.send(JSON.parse(result));
        const paymentOption = await this.getShippingOptions(req);
        client.setEx(key, 3000, JSON.stringify(paymentOption));
        return res.send(paymentOption);
      });
    } catch (error) {
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
