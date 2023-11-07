/* eslint-disable no-await-in-loop */
const { ResponseError } = require('../../errors');

const shippingMethodFormatter = (arr = []) => {
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

const courier = ['jne', 'tiki', 'pos'];
const rajaOngkirHeader = {
  key: process.env.RajaOngkir_api_key,
  'content-type': 'application/json',
};

const fetchRajaOngkir = async (body) => {
  const temp = [];
  const data = {};
  for (let i = 0; i < courier.length; i += 1) {
    body.courier = courier[i];
    const response = await fetch(`https://api.rajaongkir.com/starter/cost`, {
      method: 'POST',
      headers: rajaOngkirHeader,
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
  data.method = shippingMethodFormatter(temp);
  return data;
};

module.exports = { fetchRajaOngkir };
