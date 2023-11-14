const getSalesReports = require('./getSalesReports');
const getSalesReportByCategory = require('./getSalesReportByCategory');
const getSalesReportByWarehouse = require('./getSalesReportByWarehouse');

const salesReportService = {
  getSalesReports,
  getSalesReportByCategory,
  getSalesReportByWarehouse,
};

module.exports = salesReportService;
