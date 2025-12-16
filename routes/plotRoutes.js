const express = require("express");
const router = express.Router();
const {
  getAllPlots,
  getPlotById,
  createPlot,
  updatePlot,
  deletePlot,
  getPlotsByProject,
  getPlotSummary,
} = require("../controllers/plotController");
const { protect } = require("../middleware/authMiddleware");

// All routes require authentication
router.use(protect);

// Summary route (must be before /:id)
router.get("/summary", getPlotSummary);

// Project-specific route
router.get("/project/:projectId", getPlotsByProject);

// Main routes
router.route("/").get(getAllPlots).post(createPlot);

// Individual plot routes
router.route("/:id").get(getPlotById).put(updatePlot).delete(deletePlot);

module.exports = router;
