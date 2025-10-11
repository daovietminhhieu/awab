const mongoose = require("mongoose");

const PotentialSchema = new mongoose.Schema({
  referral: { type: mongoose.Schema.Types.ObjectId, ref: "AloWorkReferrals", required: true },
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "AloWorkUser", required: true },
  programm: { type: mongoose.Schema.Types.ObjectId, ref: "Programm", required: true },

  candidate: { type: mongoose.Schema.Types.ObjectId, ref: "AloWorkUser" },

  candidateInfo: {
    fullName: String,
    email: String,
    phone: String,
    resumeFile: String,
    coverLetter: String,
    otherDocs: [String],
  },

  createdAt: { type: Date, default: Date.now }
});

PotentialSchema.pre("validate", function (next) {
  if (!this.candidate && !this.candidateInfo) {
    next(new Error("Either candidate or candidateInfo is required."));
  } else {
    next();
  }
});

module.exports = mongoose.model("Potential", PotentialSchema);
