const mongoose = require("mongoose");

const accountTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Account type name is required"],
      trim: true,
      unique: true,
    },
    code: {
      type: String,
      required: [true, "Account type code is required"],
      trim: true,
      uppercase: true,
      unique: true,
    },
    financialComponent: {
      type: String,
      required: [true, "Financial component is required"],
      enum: ["salary", "pay roll", "pr expenses", "miscellaneous expenses"],
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
// Note: name and code already have unique indexes via unique: true

module.exports = mongoose.model("AccountType", accountTypeSchema);
