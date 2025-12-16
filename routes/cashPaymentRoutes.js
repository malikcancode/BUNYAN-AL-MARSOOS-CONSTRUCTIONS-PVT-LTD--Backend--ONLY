const express = require("express");
const router = express.Router();
const {
  getAllCashPayments,
  getCashPaymentById,
  createCashPayment,
  updateCashPayment,
  deleteCashPayment,
  getCashPaymentsByProject,
  getCashPaymentsByDateRange,
  getExpenseAccounts,
} = require("../controllers/cashPaymentController");
const { protect } = require("../middleware/authMiddleware");

// All routes require authentication
router.use(protect);

// Specific routes must come BEFORE parameterized routes
router.route("/expense-accounts").get(getExpenseAccounts);

// Main routes
router.route("/").get(getAllCashPayments).post(createCashPayment);

// Date range route
router.route("/daterange").get(getCashPaymentsByDateRange);

// Project-specific route
router.route("/project/:projectId").get(getCashPaymentsByProject);

// Individual payment routes
router
  .route("/:id")
  .get(getCashPaymentById)
  .put(updateCashPayment)
  .delete(deleteCashPayment);

module.exports = router;
