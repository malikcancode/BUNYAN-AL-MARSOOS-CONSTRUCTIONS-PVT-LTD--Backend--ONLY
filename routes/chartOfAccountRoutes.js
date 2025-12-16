const express = require("express");
const router = express.Router();
const {
  getChartOfAccounts,
  getChartOfAccountById,
  createChartOfAccount,
  updateChartOfAccount,
  deleteChartOfAccount,
  getAccountTypesEnum,
} = require("../controllers/chartOfAccountController");
const { protect } = require("../middleware/authMiddleware");

// Get account types enum
router.get("/enums/types", protect, getAccountTypesEnum);

// CRUD operations
router
  .route("/")
  .get(protect, getChartOfAccounts)
  .post(protect, createChartOfAccount);

router
  .route("/:id")
  .get(protect, getChartOfAccountById)
  .put(protect, updateChartOfAccount)
  .delete(protect, deleteChartOfAccount);

module.exports = router;
