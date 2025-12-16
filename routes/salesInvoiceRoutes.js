const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getAllSalesInvoices,
  getSalesInvoiceById,
  createSalesInvoice,
  updateSalesInvoice,
  deleteSalesInvoice,
  getSalesInvoicesByCustomer,
  getSalesInvoicesByProject,
  getSalesInvoicesByDateRange,
} = require("../controllers/salesInvoiceController");

// Base routes
router
  .route("/")
  .get(protect, getAllSalesInvoices)
  .post(protect, createSalesInvoice);

// Date range route (must be before /:id)
router.route("/daterange").get(protect, getSalesInvoicesByDateRange);

// Customer and project specific routes
router.route("/customer/:customerId").get(protect, getSalesInvoicesByCustomer);
router.route("/project/:projectId").get(protect, getSalesInvoicesByProject);

// Single invoice routes
router
  .route("/:id")
  .get(protect, getSalesInvoiceById)
  .put(protect, updateSalesInvoice)
  .delete(protect, deleteSalesInvoice);

module.exports = router;
