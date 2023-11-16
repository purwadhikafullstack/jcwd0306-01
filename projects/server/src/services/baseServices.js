const CryptoJS = require('crypto-js');
const { ResponseError } = require('../errors');

const db = require(`../models`);

class Service {
  constructor(modelName) {
    this.db = db[modelName];
  }

  async getAll(option = {}) {
    try {
      const result = await this.db.findAndCountAll({
        logging: false,
        distinct: true,
        ...option,
      });
      return result;
    } catch (error) {
      throw new ResponseError(error?.message, 400);
    }
  }

  getByUserId = async (req, option = {}) => {
    const { userId } = req.params;
    try {
      const result = await this.db.findAndCountAll({
        where: { userId },
        order: [
          ['isDefault', 'DESC'],
          ['updatedAt', 'DESC'],
        ],
        logging: false,
        distinct: true,
        ...option,
      });
      if (option?.limit)
        result.number_of_pages = Math.ceil(
          result.count / Number(option?.limit)
        );
      return result;
    } catch (err) {
      throw new ResponseError(err?.message, 400);
    }
  };

  async getByID(req, option = {}) {
    try {
      const { id } = req.params;
      const result = await this.db.findByPk(id, { ...option });
      return result;
    } catch (error) {
      throw new ResponseError(error?.message, 400);
    }
  }

  async getOneByID(req, option = {}) {
    try {
      const { id } = req.params;
      const result = await this.db.findOne({
        ...option,
        where: { ...option.where, id },
        // logging: false,
      });
      return result;
    } catch (error) {
      throw new ResponseError(error?.message, 400);
    }
  }

  async create(req, option = {}) {
    try {
      const result = await this.db.create(
        { ...req.body },
        { logging: false, ...option }
      );
      delete result.dataValues?.password;
      return result.dataValues;
    } catch (error) {
      throw new ResponseError(error?.message, 406);
    }
  }

  async update(req, option = {}) {
    try {
      const { id } = req.params;
      const result = await this.db.update(
        { ...req.body },
        { where: { id }, logging: false, ...option }
      );
      return result;
    } catch (error) {
      throw new ResponseError(error?.message, 406);
    }
  }

  async delete(req) {
    try {
      const { id } = req.params;
      const result = await this.db.destroy({ where: { id } });
      return result;
    } catch (error) {
      throw new ResponseError(error?.message, 406);
    }
  }

  encryptMultiResult(objectResult = {}) {
    const temp = [];
    objectResult.rows.forEach((val) => {
      temp.push(this.encryptID(val.dataValues));
    });

    return { ...objectResult, rows: temp };
  }

  encryptID(dataValues = {}) {
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(dataValues.id),
      process.env.JWT_SECRET_KEY
    ).toString();
    const encoded = CryptoJS.enc.Base64.parse(encrypted).toString(
      CryptoJS.enc.Hex
    );
    return { ...dataValues, id: encoded, plain_id: dataValues.id };
  }

  static decryptID(encodedID) {
    const decoded = CryptoJS.enc.Hex.parse(encodedID).toString(
      CryptoJS.enc.Base64
    );
    const decrypted = CryptoJS.AES.decrypt(
      decoded,
      process.env.JWT_SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);
    return Number(decrypted);
  }

  optGetStock = {
    attributes: {
      include: [
        [
          db.sequelize.literal(
            'CAST((SELECT SUM(WarehouseProducts.stock) FROM WarehouseProducts WHERE WarehouseProducts.productId = Product.id) AS SIGNED)'
          ),
          'stock',
        ],
      ],
    },
  };
}

module.exports = Service;
