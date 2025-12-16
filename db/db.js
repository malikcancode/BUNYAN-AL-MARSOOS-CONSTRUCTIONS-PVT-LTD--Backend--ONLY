const mongoose = require("mongoose");

let isConnected = false;
let reconnectionAttempts = 0;
const MAX_RECONNECTION_ATTEMPTS = 10;
const RECONNECTION_DELAY = 5000; // 5 seconds

// Automatic reconnection function
const attemptReconnection = async () => {
  if (reconnectionAttempts >= MAX_RECONNECTION_ATTEMPTS) {
    console.error("✗ Max reconnection attempts reached");
    return;
  }

  reconnectionAttempts++;
  console.log(
    `⏳ Attempting to reconnect to MongoDB (${reconnectionAttempts}/${MAX_RECONNECTION_ATTEMPTS})...`
  );

  try {
    await connectDB();
    reconnectionAttempts = 0; // Reset counter on successful connection
  } catch (error) {
    console.error(
      `✗ Reconnection attempt ${reconnectionAttempts} failed:`,
      error.message
    );
    // Schedule next reconnection attempt
    setTimeout(attemptReconnection, RECONNECTION_DELAY);
  }
};

const connectDB = async () => {
  // If already connected, return the existing connection
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log("✓ Using existing MongoDB connection");
    return mongoose.connection;
  }

  // If connection is in progress, wait for it
  if (mongoose.connection.readyState === 2) {
    console.log("⏳ Connection already in progress, waiting...");
    isConnected = false;
    return new Promise((resolve, reject) => {
      mongoose.connection.once("connected", () => {
        isConnected = true;
        resolve(mongoose.connection);
      });
      mongoose.connection.once("error", (err) => {
        isConnected = false;
        reject(err);
      });
    });
  }

  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MongoDB URI is not defined in environment variables");
    }

    // Configure mongoose for serverless environment
    mongoose.set("strictQuery", false);
    mongoose.set("bufferCommands", false); // Disable buffering for serverless

    const connection = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 20000,
      socketTimeoutMS: 60000,
      connectTimeoutMS: 20000,
      maxPoolSize: 5,
      minPoolSize: 0,
    });

    isConnected = true;
    reconnectionAttempts = 0; // Reset on successful connection
    console.log("✓ MongoDB connected successfully");
    console.log(`✓ Database: ${mongoose.connection.name}`);
    return connection;
  } catch (error) {
    console.error("✗ MongoDB connection failed:", error.message);
    console.error("✗ Please check your MONGO_URI environment variable");
    console.error(
      "✗ Make sure to whitelist 0.0.0.0/0 in MongoDB Atlas Network Access"
    );
    isConnected = false;
    throw error; // Don't exit process in serverless environment
  }
};

// Handle connection events
mongoose.connection.on("connected", () => {
  isConnected = true;
  reconnectionAttempts = 0;
  console.log("✓ Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  isConnected = false;
  console.error("✗ Mongoose connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  isConnected = false;
  console.log("⚠ Mongoose disconnected from MongoDB");
  // Attempt to reconnect
  setTimeout(attemptReconnection, RECONNECTION_DELAY);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("✓ Mongoose connection closed");
    process.exit(0);
  } catch (error) {
    console.error("✗ Error closing Mongoose connection:", error);
    process.exit(1);
  }
});

module.exports = connectDB;
