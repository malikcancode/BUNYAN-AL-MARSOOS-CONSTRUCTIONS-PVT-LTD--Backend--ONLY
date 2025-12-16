require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const ensureDbConnection = require("./middleware/dbConnection");

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// SECURITY MIDDLEWARE CONFIGURATION
// ============================================

// CORS configuration - MUST be first to handle preflight requests
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Set security HTTP headers using Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
    frameguard: { action: "deny" },
    xssFilter: true,
    noSniff: true,
    ieNoOpen: true,
    hidePoweredBy: true,
  })
);

// Body parser with size limits to prevent payload attacks
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Cookie parser for secure cookie handling
app.use(cookieParser());

// Data sanitization against NoSQL query injection
// Custom implementation for Express 5.x compatibility
app.use((req, res, next) => {
  // Helper function to recursively sanitize objects
  const sanitizeObject = (obj) => {
    if (obj === null || typeof obj !== "object") return obj;

    const sanitized = Array.isArray(obj) ? [] : {};

    for (const [key, value] of Object.entries(obj)) {
      // Only remove keys that start with $ (MongoDB operators)
      // Don't sanitize dots in keys as they're usually safe in property names
      const sanitizedKey = key.replace(/^\$+/, "");

      if (typeof value === "object" && value !== null) {
        sanitized[sanitizedKey] = sanitizeObject(value);
      } else if (typeof value === "string") {
        // Only remove $ from string values (MongoDB operators like $where)
        // Keep dots as they're valid in emails, URLs, etc.
        sanitized[sanitizedKey] = value.replace(/\$/g, "");
      } else {
        sanitized[sanitizedKey] = value;
      }
    }

    return sanitized;
  };

  // Sanitize body (writable)
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeObject(req.body);
  }

  // Sanitize params (writable)
  if (req.params && typeof req.params === "object") {
    req.params = sanitizeObject(req.params);
  }

  // Store sanitized query separately (req.query is read-only in Express 5.x)
  if (req.query && typeof req.query === "object") {
    req.sanitizedQuery = sanitizeObject(req.query);
  }

  next();
});

// Data sanitization against XSS attacks
// Custom implementation for Express 5.x compatibility
app.use((req, res, next) => {
  // Helper function to sanitize XSS from strings
  const sanitizeXSS = (value) => {
    if (typeof value === "string") {
      return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;")
        .replace(/\//g, "&#x2F;");
    }
    return value;
  };

  // Recursively sanitize objects
  const sanitizeObjectXSS = (obj) => {
    if (obj === null || typeof obj !== "object") return obj;

    const sanitized = Array.isArray(obj) ? [] : {};

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "object" && value !== null) {
        sanitized[key] = sanitizeObjectXSS(value);
      } else {
        sanitized[key] = sanitizeXSS(value);
      }
    }

    return sanitized;
  };

  // Sanitize body
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeObjectXSS(req.body);
  }

  // Sanitize params
  if (req.params && typeof req.params === "object") {
    req.params = sanitizeObjectXSS(req.params);
  }

  // Add XSS sanitized query if not already done
  if (req.query && typeof req.query === "object" && !req.sanitizedQuery) {
    req.sanitizedQuery = sanitizeObjectXSS(req.query);
  } else if (req.sanitizedQuery) {
    req.sanitizedQuery = sanitizeObjectXSS(req.sanitizedQuery);
  }

  next();
});

// Prevent HTTP Parameter Pollution attacks
// Custom implementation for Express 5.x compatibility
app.use((req, res, next) => {
  // HPP protection: if sanitizedQuery exists, ensure no array pollution
  if (req.sanitizedQuery && typeof req.sanitizedQuery === "object") {
    const cleaned = {};
    for (const [key, value] of Object.entries(req.sanitizedQuery)) {
      // If value is an array, take only the last value
      cleaned[key] = Array.isArray(value) ? value[value.length - 1] : value;
    }
    req.sanitizedQuery = cleaned;
  }

  next();
});

// Log environment check
console.log("Environment check:", {
  hasMongoUri: !!process.env.MONGO_URI,
  hasJwtSecret: !!process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV,
  port: PORT,
  frontendUrl: process.env.FRONTEND_URL,
});

console.log(
  "CORS allowed origins:",
  [
    "http://localhost:5173",
    "http://localhost:3000",
    process.env.FRONTEND_URL,
  ].filter(Boolean)
);

// Apply database connection middleware to all routes
app.use(ensureDbConnection);

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const customerRoutes = require("./routes/customerRoutes");
const chartOfAccountRoutes = require("./routes/chartOfAccountRoutes");
const bankPaymentRoutes = require("./routes/bankPaymentRoutes");
const itemRoutes = require("./routes/itemRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const salesInvoiceRoutes = require("./routes/salesInvoiceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const accountTypeRoutes = require("./routes/accountTypeRoutes");
const reportRoutes = require("./routes/reportRoutes");
const journalEntryRoutes = require("./routes/journalEntryRoutes");
const generalLedgerRoutes = require("./routes/generalLedgerRoutes");
const cashPaymentRoutes = require("./routes/cashPaymentRoutes");
const plotRoutes = require("./routes/plotRoutes");
const requestApprovalRoutes = require("./routes/requestApprovalRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/chartofaccounts", chartOfAccountRoutes);
app.use("/api/bankpayments", bankPaymentRoutes);
app.use("/api/cashpayments", cashPaymentRoutes);
app.use("/api/plots", plotRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/sales-invoices", salesInvoiceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/account-types", accountTypeRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/journal-entries", journalEntryRoutes);
app.use("/api/general-ledger", generalLedgerRoutes);
app.use("/api/request-approvals", requestApprovalRoutes);
app.use("/api/notifications", notificationRoutes);

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Construction Management System API",
    status: "Server is running",
    version: "1.0.0",
    documentation: "Visit /api for available endpoints",
    endpoints: {
      api: "/api",
      test: "/api/test",
      health: "/api/health",
    },
  });
});

// API base route
app.get("/api", (req, res) => {
  res.status(200).json({
    message: "Construction Management System API",
    status: "Server is running",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      projects: "/api/projects",
      customers: "/api/customers",
      chartofaccounts: "/api/chartofaccounts",
      bankpayments: "/api/bankpayments",
      cashpayments: "/api/cashpayments",
      items: "/api/items",
      purchases: "/api/purchases",
      suppliers: "/api/suppliers",
      salesInvoices: "/api/sales-invoices",
      dashboard: "/api/dashboard",
      accountTypes: "/api/account-types",
      reports: "/api/reports",
      journalEntries: "/api/journal-entries",
      generalLedger: "/api/general-ledger",
      requestApprovals: "/api/request-approvals",
    },
  });
});

// Test endpoint
app.get("/api/test", (req, res) => {
  res.status(200).json({
    message: "API is working",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  const mongoose = require("mongoose");
  const isConnected = mongoose.connection.readyState === 1;

  res.status(isConnected ? 200 : 503).json({
    status: isConnected ? "healthy" : "unhealthy",
    database: isConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.url} not found`,
    availableEndpoints: {
      api: "/api",
      test: "/api/test",
      health: "/api/health",
      auth: "/api/auth",
      users: "/api/users",
      projects: "/api/projects",
      customers: "/api/customers",
      chartofaccounts: "/api/chartofaccounts",
      bankpayments: "/api/bankpayments",
      cashpayments: "/api/cashpayments",
      items: "/api/items",
      purchases: "/api/purchases",
      suppliers: "/api/suppliers",
      salesInvoices: "/api/sales-invoices",
      dashboard: "/api/dashboard",
      accountTypes: "/api/account-types",
      reports: "/api/reports",
      journalEntries: "/api/journal-entries",
      generalLedger: "/api/general-ledger",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV}`);
});
