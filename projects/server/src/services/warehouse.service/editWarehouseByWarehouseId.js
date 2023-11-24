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
  if (city.provinceId !== provinceId)
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

async function editWarehouse(warehouseId, values, transaction) {
  await Warehouse.update(values, {
    paranoid: false,
    where: { id: warehouseId },
    fields: ['name'],
    transaction,
    logging: false,
  });
}

async function editWarehouseAddress(warehouseId, values, transaction) {
  await WarehouseAddress.update(values, {
    where: { warehouseId },
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

async function editWarehouseByWarehouseId(req) {
  const warehouse = await sequelize.transaction(async (t) => {
    const { warehouseId } = req.params;
    if (req.body.provinceId && req.body.cityId) await getLocation(req, t);
    await editWarehouse(warehouseId, req.body, t);
    await editWarehouseAddress(warehouseId, req.body, t);
    const result = await Warehouse.findByPk(warehouseId, {
      paranoid: false,
      include: [
        {
          model: WarehouseAddress,
          include: [{ model: Province }, { model: City }],
          paranoid: false,
        },
      ],
      transaction: t,
      logging: false,
    });
    if (!result) throw new ResponseError('Warehouse not found', 404);
    return result;
  });
  return warehouse;
}

module.exports = editWarehouseByWarehouseId;
