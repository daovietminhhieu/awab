const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  referral: { type: mongoose.Schema.Types.ObjectId, ref: "AloWorkReferrals", required: true },
  step: { type: Number },

  action: {
    type: String,
    enum: ["request_step", "approve_step", "reject_step", "approve_referral", "reject_referral"],
    required: true
  },

  amount: { type: Number, default: 0 },

  admin: { type: mongoose.Schema.Types.ObjectId, ref: "AloWorkUser" },
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "AloWorkUser" },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: "AloWorkUser" },

  status: {
    type: String,
    enum: ["pending", "in_review", "approved", "rejected", "completed", "failed"],
    default: "pending"
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transaction", TransactionSchema);
