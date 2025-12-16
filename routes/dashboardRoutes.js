const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getDashboardStats,
  getRecentProjects,
  getPlotStats,
  getInventoryStats,
  getExpenseBreakdown,
  getRevenueTrend,
  getRevenueVsExpenses,
  getProjectStatusDistribution,
  getCashFlow,
  getTopProjects,
  getProjectsOverBudget,
  getAccountsReceivable,
  getAccountsPayable,
  getLowStockAlerts,
  getTopSuppliers,
  getTopCustomers,
} = require("../controllers/dashboardController");

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get("/stats", protect, getDashboardStats);

// @route   GET /api/dashboard/recent-projects
// @desc    Get recent projects
// @access  Private
router.get("/recent-projects", protect, getRecentProjects);

// @route   GET /api/dashboard/plot-stats
// @desc    Get plot statistics
// @access  Private
router.get("/plot-stats", protect, getPlotStats);

// @route   GET /api/dashboard/inventory-stats
// @desc    Get inventory statistics (materials only)
// @access  Private
router.get("/inventory-stats", protect, getInventoryStats);

// @route   GET /api/dashboard/expense-breakdown
// @desc    Get expense breakdown by category
// @access  Private
router.get("/expense-breakdown", protect, getExpenseBreakdown);

// @route   GET /api/dashboard/revenue-trend
// @desc    Get monthly revenue trend
// @access  Private
router.get("/revenue-trend", protect, getRevenueTrend);

// @route   GET /api/dashboard/revenue-vs-expenses
// @desc    Get revenue vs expenses comparison
// @access  Private
router.get("/revenue-vs-expenses", protect, getRevenueVsExpenses);

// @route   GET /api/dashboard/project-status
// @desc    Get project status distribution
// @access  Private
router.get("/project-status", protect, getProjectStatusDistribution);

// @route   GET /api/dashboard/cash-flow
// @desc    Get cash flow summary
// @access  Private
router.get("/cash-flow", protect, getCashFlow);

// @route   GET /api/dashboard/top-projects
// @desc    Get top 5 projects by revenue
// @access  Private
router.get("/top-projects", protect, getTopProjects);

// @route   GET /api/dashboard/projects-over-budget
// @desc    Get projects over budget
// @access  Private
router.get("/projects-over-budget", protect, getProjectsOverBudget);

// @route   GET /api/dashboard/accounts-receivable
// @desc    Get accounts receivable summary
// @access  Private
router.get("/accounts-receivable", protect, getAccountsReceivable);

// @route   GET /api/dashboard/accounts-payable
// @desc    Get accounts payable summary
// @access  Private
router.get("/accounts-payable", protect, getAccountsPayable);

// @route   GET /api/dashboard/low-stock-alerts
// @desc    Get low stock alerts
// @access  Private
router.get("/low-stock-alerts", protect, getLowStockAlerts);

// @route   GET /api/dashboard/top-suppliers
// @desc    Get top suppliers by volume
// @access  Private
router.get("/top-suppliers", protect, getTopSuppliers);

// @route   GET /api/dashboard/top-customers
// @desc    Get top customers by revenue
// @access  Private
router.get("/top-customers", protect, getTopCustomers);

module.exports = router;
