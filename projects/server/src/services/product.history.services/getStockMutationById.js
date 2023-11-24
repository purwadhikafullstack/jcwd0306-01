const { StockMutation, Product, Warehouse, User } = require('../../models');

async function getStockMutationById() {
  const data = await StockMutation.findAll();

  return data;
}

module.exports = getStockMutationById;
