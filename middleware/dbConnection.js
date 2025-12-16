const connectDB = require("../db/db");

// Middleware to ensure database connection before handling requests
const ensureDbConnection = async (req, res, next) => {
  try {
    // Try to connect with up to 3 retries
    let retries = 0;
    const maxRetries = 3;

    while (retries < maxRetries) {
      try {
        await connectDB();
        return next();
      } catch (error) {
        retries++;
        if (retries < maxRetries) {
          console.log(
            `⏳ Reconnection attempt ${retries}/${maxRetries - 1}...`
          );
          await new Promise((resolve) => setTimeout(resolve, 1000 * retries)); // Exponential backoff
        } else {
          throw error;
        }
      }
    }
  } catch (error) {
    console.error("Database connection failed:", error.message);
    res.status(503).json({
      error: "Service Unavailable",
      message: "Database connection failed. Please try again later.",
    });
  }
};

module.exports = ensureDbConnection;
