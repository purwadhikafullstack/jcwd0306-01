const { salesReportService } = require('../services');
const { sendResponse } = require('../utils');

const salesReportController = {
  getSalesReports: async (req, res) => {
    try {
      const orders = await salesReportService.getSalesReports(req);
      sendResponse({ res, statusCode: 200, data: orders });
    } catch (error) {
      sendResponse({ res, error });
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

  getTotalSalesRevenue: async (req, res) => {
    try {
      const result = await salesReportService.getTotalSalesRevenue();
      sendResponse({ res, statusCode: 200, data: result });
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  getOrderStatuses: async (req, res) => {
    try {
      const result = await salesReportService.getOrderStatuses();
      sendResponse({ res, statusCode: 200, data: result });
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  getProductSold: async (req, res) => {
    try {
      const result = await salesReportService.getProductSold();
      sendResponse({ res, statusCode: 200, data: result });
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  getOrderByWarehouseId: async (req, res) => {
    try {
      const result = await salesReportService.getOrderByWarehouse(req);
      sendResponse({ res, statusCode: 200, data: result });
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  getrevenueByWarehouse: async (req, res) => {
    try {
      const result = await salesReportService.getrevenueByWarehouse(req);
      sendResponse({ res, statusCode: 200, data: result });
    } catch (error) {
      sendResponse({ res, error });
    }
  },
};

module.exports = salesReportController;
