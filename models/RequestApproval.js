const mongoose = require("mongoose");

const requestApprovalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requestType: {
      type: String,
      enum: [
        "create_project",
        "edit_project",
        "create_sales_invoice",
        "edit_sales_invoice",
        "create_cash_payment",
        "edit_cash_payment",
        "create_bank_payment",
        "edit_bank_payment",
        "create_purchase",
        "edit_purchase",
        "create_plot",
        "edit_plot",
        "create_customer",
        "edit_customer",
        "create_supplier",
        "edit_supplier",
        "create_user",
        "edit_user",
      ],
      required: true,
    },
    requestData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    // Generic reference field for any entity being edited
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    // Deprecated - keeping for backward compatibility with existing project requests
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    adminResponse: {
      type: String,
      default: null,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
requestApprovalSchema.index({ userId: 1, status: 1 });
requestApprovalSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("RequestApproval", requestApprovalSchema);
