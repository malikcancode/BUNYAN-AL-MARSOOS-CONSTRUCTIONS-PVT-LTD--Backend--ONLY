const express = require("express");
const router = express.Router();
const {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerByCode,
} = require("../controllers/customerController");
const { protect } = require("../middleware/authMiddleware");

// All routes are protected
router.use(protect);

// @route   GET /api/customers
// @desc    Get all customers
router.get("/", getAllCustomers);

// @route   GET /api/customers/code/:code
// @desc    Get customer by code
router.get("/code/:code", getCustomerByCode);

// @route   GET /api/customers/:id
// @desc    Get single customer by ID
router.get("/:id", getCustomerById);

// @route   POST /api/customers
// @desc    Create new customer
router.post("/", createCustomer);

// @route   PUT /api/customers/:id
// @desc    Update customer
router.put("/:id", updateCustomer);

// @route   DELETE /api/customers/:id
// @desc    Delete customer
router.delete("/:id", deleteCustomer);

module.exports = router;
