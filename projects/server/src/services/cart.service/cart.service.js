const { Op } = require('sequelize');
const db = require('../../models');
const { sequelize } = require('../../models');
const Service = require('../baseServices');

const optionGetCartByUserId = {
  limit: 20,
  attributes: {
    include: [
      [
        sequelize.literal(
          `(SELECT SUM(WarehouseProducts.stock) FROM WarehouseProducts WHERE WarehouseProducts.productId = Cart.productId)`
        ),
        'stock',
      ],
    ],
  },
  include: db.Product,
};

class Cart extends Service {
  getCartByUserId = (req) => this.getByUserId(req, optionGetCartByUserId);

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
