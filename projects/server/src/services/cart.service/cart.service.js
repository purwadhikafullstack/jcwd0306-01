const { Op } = require('sequelize');
const db = require('../../models');
const { sequelize } = require('../../models');
const Service = require('../baseServices');
const { ResponseError } = require('../../errors');

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
  include: {
    model: db.Product,
    include: { model: db.ProductImage, attributes: ['id'] },
  },
};

class Cart extends Service {
  getCartByUserId = (req) => this.getByUserId(req, optionGetCartByUserId);

  createCart = async (req) => {
    const cart = await sequelize.transaction(async (t) => {
      const userId = req.user.id;
      const { productId, quantity, note } = req.body;

      const [data, isCreated] = await this.db.findOrCreate({
        where: { userId, productId },
        defaults: { userId, productId, quantity, note },
        transaction: t,
      });

      if (!isCreated) {
        const prevQuantity = data.getDataValue('quantity');
        await data.update(
          { quantity: prevQuantity + quantity, note },
          { transaction: t }
        );
      }

      return data.toJSON();
    });
    return cart;
  };

  updateCart = async (req) => {
    const { values } = req.body;
    try {
      await sequelize.transaction(async (t) => {
        await this.db.bulkCreate(values, {
          logging: false,
          transaction: t,
          updateOnDuplicate: ['quantity', 'isChecked', 'note'],
        });
      });
      return 'success';
    } catch (err) {
      throw new ResponseError(err?.message, 400);
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
      throw new ResponseError(err?.message, 400);
    }
  };
}

module.exports = new Cart('Cart');
