const getSalesReports = require('./getSalesReports');
const getSalesReportByCategory = require('./getSalesReportByCategory');
const getSalesReportByWarehouse = require('./getSalesReportByWarehouse');
const getTotalSalesRevenue = require('./getTotalSalesRevenue');
const getOrderStatuses = require('./getOrderStatuses');
const getProductSold = require('./getProductSold');
const getOrderByWarehouse = require('./getOrderByWarehouse');
const getrevenueByWarehouse = require('./getRevenueByWarehouse');

const salesReportService = {
  getSalesReports,
  getSalesReportByCategory,
  getSalesReportByWarehouse,
  getTotalSalesRevenue,
  getOrderStatuses,
  getProductSold,
  getOrderByWarehouse,
  getrevenueByWarehouse,
};

module.exports = salesReportService;
