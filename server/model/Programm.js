const mongoose = require("mongoose");

// --- Schema cho các bước của referral ---
const StepSchema = new mongoose.Schema({
  step: { type: Number, required: true },
  name: { type: String, required: true },
  bonus: { type: Number, default: 0 },
  status: { type: String, enum: ["pending", "in_review", "completed", "rejected"], default: "pending" },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "AloWorkUser" },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "AloWorkUser" },
  updatedAt: { type: Date, default: Date.now },
});

// --- Schema cho reviews ---
const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "AloWorkUser", default: null },
  rate: { type: Number, min: 1, max: 5, required: true },
  content: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

// --- Schema cho Q&A ---
const ProgrammQASchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, default: null },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "AloWorkUser", default: null },
  userName: { type: String, default: "Guest" },
  createdAt: { type: Date, default: Date.now },
  answeredAt: { type: Date },
  answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: "AloWorkUser" },
  answeredByName: { type: String },
});

// --- Schema chính của chương trình ---
const ProgrammSchema = new mongoose.Schema({
  title: { type: String },
  company: { type: String },
  logoL: { type: String },
  type: { type: String },
  degrees: { type: String },
  duration: { type: String },
  land: { type: String },
  fee: { type: String },
  expected_salary: { type: String },
  deadline: { type: String },
  bonus: { type: String },
  vacancies: { type: String },
  hired: { type: String },
  details: {
    overview: { type: String },
    other: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  requirement: {
    age: { type: String },
    health: { type: String },
    education: { type: String },
    certificate: { type: String },
  },
  benefit: { type: String },
  reviews: { type: [ReviewSchema], default: [] },
  qa: { type: [ProgrammQASchema], default: [] }, // ✅ đảm bảo không bị validation error
  videos: { type: String },
  number_of_comments: { type: String },
  is_active: { type: String, default: "true" },
  completed: { type: String },
  public_day: { type: String },
  category: { type: String, enum: ["job", "studium"] },
  steps: [StepSchema],
  partner: { type: mongoose.Schema.Types.ObjectId, ref: "AloWorkUser" },
  referrals: { type: mongoose.Schema.Types.ObjectId, ref: "Referrals" },
});

const Programm = mongoose.model("Programm", ProgrammSchema);
module.exports = Programm;
