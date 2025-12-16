const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { blacklistToken } = require("../middleware/authMiddleware");

// Generate JWT Token with enhanced security
const generateToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
      iat: Math.floor(Date.now() / 1000), // Issued at timestamp
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
      algorithm: "HS256", // Explicitly specify algorithm
    }
  );
};

// @desc    Register a new user (Admin only via Postman)
// @route   POST /api/auth/register
// @access  Public (but should be restricted in production)
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || "user",
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Error registering user",
      error: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const startTime = Date.now();
    console.log("🔐 LOGIN REQUEST:", {
      email: req.body.email,
      timestamp: new Date().toISOString(),
      ip: req.ip,
    });

    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      console.log("❌ LOGIN FAILED: Missing credentials");
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user and include password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      console.log("❌ LOGIN FAILED: User not found for email:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      console.log("❌ LOGIN FAILED: Account deactivated for email:", email);
      return res.status(401).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    // Verify password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      console.log("❌ LOGIN FAILED: Invalid password for email:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = generateToken(user._id);

    const duration = Date.now() - startTime;
    console.log("✅ LOGIN SUCCESSFUL:", {
      email,
      userId: user._id,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          customPermissions: user.customPermissions,
        },
        token,
      },
    });
  } catch (error) {
    console.error("❌ LOGIN ERROR:", {
      error: error.message,
      name: error.name,
      email: req.body?.email,
      timestamp: new Date().toISOString(),
      stack: error.stack,
    });
    res.status(500).json({
      success: false,
      message: "Error logging in",
      error: error.message,
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        customPermissions: user.customPermissions,
      },
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message,
    });
  }
};

// @desc    Logout user (blacklist token)
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    // Get token from request (set by protect middleware)
    const token = req.token;

    if (token) {
      // Add token to blacklist
      blacklistToken(token);
    }

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Error logging out",
      error: error.message,
    });
  }
};
