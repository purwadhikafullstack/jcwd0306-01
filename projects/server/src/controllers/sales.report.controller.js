const { salesReportService } = require('../services');
const { sendResponse } = require('../utils');

const salesReportController = {
  getSalesReports: async (req, res) => {
    try {
      const orders = await salesReportService.getSalesReports(req);
      sendResponse({ res, statusCode: 200, data: orders });
    } catch (error) {
      sendResponse({ res, error });
      console.log(error);
    }
  },

  getSalesReportByCategory: async (req, res) => {
    try {
      const result = await salesReportService.getSalesReportByCategory(req);
      sendResponse({ res, statusCode: 200, data: result });
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  getSalesReportByWarehouse: async (req, res) => {
    try {
      const result = await salesReportService.getSalesReportByWarehouse(req);
      sendResponse({ res, statusCode: 200, data: result });
    } catch (error) {
      sendResponse({ res, error });
    }
  },
};

module.exports = salesReportController;
