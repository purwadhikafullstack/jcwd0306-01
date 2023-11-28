const getSalesReports = require('./getSalesReports');
const getSalesReportByCategory = require('./getSalesReportByCategory');
const getSalesReportByWarehouse = require('./getSalesReportByWarehouse');
const getTotalSalesRevenue = require('./getTotalSalesRevenue');
const getOrderStatuses = require('./getOrderStatuses');
const getProductSold = require('./getProductSold');

const salesReportService = {
  getSalesReports,
  getSalesReportByCategory,
  getSalesReportByWarehouse,
  getTotalSalesRevenue,
  getOrderStatuses,
  getProductSold,
};

module.exports = salesReportService;
