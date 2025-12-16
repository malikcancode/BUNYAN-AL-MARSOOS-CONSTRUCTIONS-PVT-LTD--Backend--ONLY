const express = require("express");
const router = express.Router();
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectLedger,
} = require("../controllers/projectController");
const { protect } = require("../middleware/authMiddleware");

// All routes are protected
router.use(protect);

// @route   POST /api/projects
// @desc    Create new project
router.post("/", createProject);

// @route   GET /api/projects
// @desc    Get all projects
router.get("/", getAllProjects);

// @route   GET /api/projects/:id/ledger
// @desc    Get project ledger with expenses and profit
router.get("/:id/ledger", getProjectLedger);

// @route   GET /api/projects/:id
// @desc    Get single project by ID
router.get("/:id", getProjectById);

// @route   PUT /api/projects/:id
// @desc    Update project
router.put("/:id", updateProject);

// @route   DELETE /api/projects/:id
// @desc    Delete project
router.delete("/:id", deleteProject);

module.exports = router;
