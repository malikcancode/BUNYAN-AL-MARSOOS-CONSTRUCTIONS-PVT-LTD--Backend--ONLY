const express = require("express");
const router = express.Router();
const {
  getAllPurchases,
  getPurchaseById,
  createPurchase,
  updatePurchase,
  deletePurchase,
  getPurchasesByVendor,
  getPurchasesByDateRange,
} = require("../controllers/purchaseController");
const { protect } = require("../middleware/authMiddleware");

// All routes are protected
router.use(protect);

// @route   GET /api/purchases
// @desc    Get all purchases
router.get("/", getAllPurchases);

// @route   GET /api/purchases/vendor/:vendorName
// @desc    Get purchases by vendor
router.get("/vendor/:vendorName", getPurchasesByVendor);

// @route   GET /api/purchases/daterange
// @desc    Get purchases by date range
router.get("/daterange", getPurchasesByDateRange);

// @route   GET /api/purchases/:id
// @desc    Get single purchase by ID
router.get("/:id", getPurchaseById);

// @route   POST /api/purchases
// @desc    Create new purchase
router.post("/", createPurchase);

// @route   PUT /api/purchases/:id
// @desc    Update purchase
router.put("/:id", updatePurchase);

// @route   DELETE /api/purchases/:id
// @desc    Delete purchase
router.delete("/:id", deletePurchase);

module.exports = router;
