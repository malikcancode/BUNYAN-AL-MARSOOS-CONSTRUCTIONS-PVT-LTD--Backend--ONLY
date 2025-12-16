const express = require("express");
const router = express.Router();
const {
  getJournalEntries,
  getJournalEntryById,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  reverseJournalEntry,
  getJournalEntriesByAccount,
  postJournalEntry,
} = require("../controllers/journalEntryController");
const { protect } = require("../middleware/authMiddleware");

// Apply authentication to all routes
router.use(protect);

// Journal entry routes
router.route("/").get(getJournalEntries).post(createJournalEntry);

router
  .route("/:id")
  .get(getJournalEntryById)
  .put(updateJournalEntry)
  .delete(deleteJournalEntry);

router.post("/:id/reverse", reverseJournalEntry);
router.post("/:id/post", postJournalEntry);
router.get("/account/:accountCode", getJournalEntriesByAccount);

module.exports = router;
