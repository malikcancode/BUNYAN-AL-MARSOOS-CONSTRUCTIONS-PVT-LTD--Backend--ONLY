const express = require("express");
const router = express.Router();
const {
  getAllSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getSuppliersByCategory,
} = require("../controllers/supplierController");
const { protect } = require("../middleware/authMiddleware");

// Apply authentication middleware to all routes
router.use(protect);

// Supplier routes
router.route("/").get(getAllSuppliers).post(createSupplier);

router
  .route("/:id")
  .get(getSupplier)
  .put(updateSupplier)
  .delete(deleteSupplier);

router.route("/category/:category").get(getSuppliersByCategory);

module.exports = router;
