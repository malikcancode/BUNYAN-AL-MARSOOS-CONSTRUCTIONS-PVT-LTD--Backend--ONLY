const mongoose = require("mongoose");

// Middleware to ensure database connection before handling requests
const ensureDbConnection = async (req, res, next) => {
  // Check if already connected (fast path - no delay)
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  // If disconnected, reject immediately instead of retrying
  // (The server should establish connection on startup)
  if (mongoose.connection.readyState !== 1) {
    console.error("❌ Database is not connected - rejecting request");
    return res.status(503).json({
      success: false,
      error: "Service Unavailable",
      message: "Database connection failed. Please try again later.",
    });
  }

  next();
};

module.exports = ensureDbConnection;
