const { Op } = require('sequelize');
const db = require('../../models');
const { sequelize } = require('../../models');
const Service = require('../baseServices');
const { ResponseError } = require('../../errors');

const optionGetCartByUserId = {
  limit: 20,
  order: [['updatedAt', 'DESC']],
  attributes: {
    include: [
      [
        sequelize.literal(
          'CAST((SELECT SUM(WarehouseProducts.stock) FROM WarehouseProducts WHERE WarehouseProducts.productId = Cart.productId) AS SIGNED)'
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
  getCartByUserId = async (req) => {
    const carts = await this.getByUserId(req, optionGetCartByUserId);
    return carts;
  };

  createCart = async (req) => {
    const cart = await sequelize.transaction(async (t) => {
      const userId = req.user.id;
      const { productId, quantity, note } = req.body;

      const product = await db.Product.findByPk(productId, {
        attributes: {
          include: [
            [
              sequelize.literal(
                'CAST((SELECT SUM(WarehouseProducts.stock) FROM WarehouseProducts WHERE WarehouseProducts.productId = Product.id) AS SIGNED)'
              ),
              'stock',
            ],
          ],
        },
        transaction: t,
      });

      const [data, isCreated] = await this.db.findOrCreate({
        where: { userId, productId },
        defaults: { userId, productId, quantity, note },
        transaction: t,
      });

      if (!isCreated) {
        const newQuantity = data.getDataValue('quantity') + quantity;
        await data.update(
          {
            quantity:
              newQuantity > product.getDataValue('stock')
                ? product.getDataValue('stock')
                : newQuantity,
            note,
          },
          { transaction: t }
        );
      }

      await data.reload({
        where: { userId, productId },
        attributes: {
          include: [
            [
              sequelize.literal(
                'CAST((SELECT SUM(WarehouseProducts.stock) FROM WarehouseProducts WHERE WarehouseProducts.productId = Cart.productId) AS SIGNED)'
              ),
              'stock',
            ],
          ],
        },
        include: {
          model: db.Product,
          include: { model: db.ProductImage, attributes: ['id'] },
        },
        transaction: t,
      });

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
