const { ResponseError } = require('../errors');

const db = require(`../models`);

class Service {
  constructor(modelName) {
    this.db = db[modelName];
  }

  async getAll(option = {}) {
    try {
      const result = await this.db.findAll({ ...option });
      return result;
    } catch (error) {
      throw new ResponseError(error?.message, 400);
    }
  }

  getByUserId = async (req, option = {}) => {
    const { userId } = req.params;
    try {
      const result = await this.db.findAll({
        where: { userId },
        logging: false,
        ...option,
      });
      return result;
    } catch (err) {
      console.log(err);
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
        logging: false,
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
}

module.exports = Service;
