const mongoose = require("mongoose");
const slugify = require("slugify"); // npm i slugify

// Schema cho các bước của referral
const StepSchema = new mongoose.Schema({
  step: { type: Number, required: true },
  name: { type: String, required: true },
  bonus: { type: Number, default: 0 },
  status: { type: String, enum: ["pending", "in_review", "completed", "rejected"], default: "pending" },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "AloWorkUser" },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "AloWorkUser" },
  updatedAt: { type: Date, default: Date.now },
});

// Schema chính
const ReferralsSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "AloWorkUser" },
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "AloWorkUser" },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: "AloWorkUser" },

  candidateInfo: {
    fullName: String,
    email: String,
    phone: String,
    resumeFile: String,
    coverLetter: String,
    otherDocs: String,
    filledAt: Date
  },

  link: String,
  slug: { type: String, unique: true }, // thêm slug
  status: {
    type: String,
    enum: ["new", "pending", "waiting_candidate", "ongoing", "completed", "rejected"],
    default: "new",
  },

  steps: [StepSchema],
  bonus: { type: Number, default: 0 },
  programm: { type: mongoose.Schema.Types.ObjectId, ref: "Programm" },

  updatedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, index: { expires: 0 } },
});

ReferralsSchema.pre("save", async function (next) {
  this.updatedAt = Date.now();

  next();
});

const AloWorkReferrals = mongoose.model("AloWorkReferrals", ReferralsSchema);
module.exports = AloWorkReferrals;
