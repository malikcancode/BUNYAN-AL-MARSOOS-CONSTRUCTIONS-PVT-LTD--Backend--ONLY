const express = require("express");
const router = express.Router();
const {
  getGeneralLedger,
  getAccountLedger,
  getAccountBalance,
  getTrialBalance,
  getBalanceSheet,
  getProfitAndLoss,
  getLedgerSummary,
} = require("../controllers/generalLedgerController");
const { protect } = require("../middleware/authMiddleware");

// Apply authentication to all routes
router.use(protect);

// General ledger routes
router.get("/", getGeneralLedger);
router.get("/summary", getLedgerSummary);
router.get("/trial-balance", getTrialBalance);
router.get("/balance-sheet", getBalanceSheet);
router.get("/profit-loss", getProfitAndLoss);
router.get("/account/:accountCode", getAccountLedger);
router.get("/balance/:accountCode", getAccountBalance);

module.exports = router;
