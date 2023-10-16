const { Op } = require('sequelize');
const db = require('../models');
const { sequelize } = require('../models');
const Service = require('./baseServices');

class Cart extends Service {
  getByUserId = async (req) => {
    const { userId } = req.params;
    const { isChecked } = req.query.selected_items;
    try {
      const result = await this.db.findAll({
        where: { userId, ...(isChecked && { isChecked: true }) },
        logging: false,
        include: [db.Product],
      });
      return result;
    } catch (err) {
      throw new Error(err?.message);
    }
  };

  updateCart = async (req) => {
    const { values } = req.body;
    try {
      await sequelize.transaction(async (t) => {
        await this.db.bulkCreate(values, {
          logging: false,
          transaction: t,
          updateOnDuplicate: ['quantity', 'isChecked'],
        });
      });
      return 'success';
    } catch (err) {
      throw new Error(err?.message);
    }
  };

  deleteItemOnCart = async (req) => {
    const userId = Number(req.params.userId);
    const { productId } = req.query;

    try {
      await sequelize.transaction(async (t) => {
        await this.db.destroy({
          where: {
            userId,
            productId: {
              [Op.in]: typeof productId === 'string' ? [productId] : productId,
            },
          },
          logging: false,
          transaction: t,
        });
      });
      return 'success';
    } catch (err) {
      throw new Error(err?.message);
    }
  };
}

module.exports = new Cart('Cart');
