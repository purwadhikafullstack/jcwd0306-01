const axios = require('axios');
const { ResponseError } = require('../../errors');
const {
  sequelize,
  Product,
  Warehouse,
  WarehouseAddress,
  Province,
  City,
} = require('../../models');

async function getProvinceName(provinceId, transaction) {
  const province = await Province.findByPk(provinceId, {
    attributes: ['name'],
    transaction,
    logging: false,
  });
  if (!province) throw new ResponseError('province not found', 404);
  return province.getDataValue('name');
}

async function getCityName(provinceId, cityId, transaction) {
  const city = await City.findByPk(cityId, {
    attributes: ['name', 'provinceId'],
    transaction,
    logging: false,
  });
  if (!city) throw new ResponseError('city not found', 404);
  if (city.getDataValue('provinceId') !== provinceId)
    throw new ResponseError(
      `city(${cityId}) is not in province(${provinceId})`,
      400
    );
  return city.getDataValue('name');
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
    logging: false,
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
    logging: false,
  });
}

async function addWarehouseProducts(warehouse, transaction) {
  const products = await Product.findAll({
    paranoid: false,
    transaction,
    logging: false,
  });
  if (products.length !== 0) {
    await warehouse.setProducts(products, {
      through: { stock: 0 },
      paranoid: false,
      transaction,
      logging: false,
    });
  }
}

async function createWarehouse(req) {
  const warehouse = await sequelize.transaction(async (t) => {
    await getLocation(req, t);
    const data = await addWarehouse(req.body, t);
    await addWarehouseAddress(data, req.body, t);
    await addWarehouseProducts(data, t);
    const result = await Warehouse.findByPk(data.getDataValue('id'), {
      include: [
        {
          model: WarehouseAddress,
          include: [{ model: Province }, { model: City }],
        },
      ],
      transaction: t,
      logging: false,
    });
    return result;
  });
  return warehouse;
}

module.exports = createWarehouse;
