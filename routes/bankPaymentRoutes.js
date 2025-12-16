const express = require("express");
const router = express.Router();
const {
  getBankPayments,
  getBankPaymentById,
  createBankPayment,
  updateBankPayment,
  deleteBankPayment,
  getBankEnum,
  getExpenseAccounts,
  generateSerialNumber,
} = require("../controllers/bankPaymentController");
const { protect } = require("../middleware/authMiddleware");

// Specific routes must come BEFORE parameterized routes
router.get("/enums/banks", protect, getBankEnum);
router.get("/expense-accounts", protect, getExpenseAccounts);
router.get("/generate-serial", protect, generateSerialNumber);

// CRUD operations
router
  .route("/")
  .get(protect, getBankPayments)
  .post(protect, createBankPayment);

router
  .route("/:id")
  .get(protect, getBankPaymentById)
  .put(protect, updateBankPayment)
  .delete(protect, deleteBankPayment);

module.exports = router;
