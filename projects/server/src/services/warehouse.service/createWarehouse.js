const axios = require('axios');
const { ResponseError } = require('../../errors');
const {
  sequelize,
  Warehouse,
  WarehouseAddress,
  Province,
  City,
} = require('../../models');

async function getProvinceName(provinceId, transaction) {
  const province = await Province.findByPk(provinceId, {
    attributes: ['name'],
    transaction,
    raw: true,
  });
  if (!province) throw new ResponseError('province not found', 404);
  return province.name;
}

async function getCityName(provinceId, cityId, transaction) {
  const city = await City.findByPk(cityId, {
    attributes: ['name', 'provinceId'],
    transaction,
    raw: true,
  });
  if (!city) throw new ResponseError('city not found', 404);
  if (city.provinceId !== provinceId)
    throw new ResponseError(
      `city(${cityId}) is not in province(${provinceId})`,
      400
    );
  return city.name;
}

async function getLocation(req, transaction) {
  const { provinceId, cityId, district, village, detail } = req.body;
  const province = await getProvinceName(provinceId, transaction);
  const city = await getCityName(provinceId, cityId, transaction);
  const place = encodeURIComponent(
    `${detail}, ${village}, ${district}, ${city}, ${province}`
  );
  const { data } = await axios.get(
    `https://api.opencagedata.com/geocode/v1/json?key=${process.env.OpenCage_api_key}&q=${place}`
  );
  req.body.latitude = data.results[0].geometry.lat;
  req.body.longitude = data.results[0].geometry.lng;
}

async function addWarehouse(values, transaction) {
  const [warehouse, isCreated] = await Warehouse.findOrCreate({
    where: { name: values.name },
    defaults: values,
    fields: ['name'],
    paranoid: false,
    transaction,
  });
  if (!isCreated) throw new ResponseError('warehouse name already exist', 400);
  return warehouse;
}

async function addWarehouseAddress(warehouse, values, transaction) {
  await warehouse.createWarehouseAddress(values, {
    fields: [
      'country',
      'provinceId',
      'cityId',
      'district',
      'village',
      'detail',
      'longitude',
      'latitude',
    ],
    transaction,
  });
}

async function createWarehouse(req) {
  const warehouse = await sequelize.transaction(async (t) => {
    await getLocation(req, t);
    const data = await addWarehouse(req.body, t);
    await addWarehouseAddress(data, req.body, t);
    const result = await Warehouse.findByPk(data.getDataValue('id'), {
      include: [
        {
          model: WarehouseAddress,
          include: [{ model: Province }, { model: City }],
        },
      ],
      transaction: t,
    });
    return result.toJSON();
  });
  return warehouse;
}

module.exports = createWarehouse;
