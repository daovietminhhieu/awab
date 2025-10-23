const mongoose = require("mongoose");
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

const ReviewSchema = new mongoose.Schema({
  // user: { type: mongoose.Schema.Types.ObjectId, ref: "AloWorkUser" },
  rate: { type: Number, min: 1, max: 5 }, // Giới hạn số sao từ 1 đến 5
  content: { type: String }, // Nội dung đánh giá
  createdAt: { type: Date, default: Date.now }, // Ngày tạo
});



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
    other: { type: String },
  },
  requirement: {
    age: { type: String },
    health: { type: String },
    education: { type: String },
    certificate: { type: String },
  },
  benefit: { type: String },
  reviews: [ReviewSchema],
  qa: { type: String },
  videos: { type: String },
  number_of_comments: { type: String },
  is_active: { type: String, default: "true" },
  completed: { type: String },
  public_day: { type: String },
  type_category: {
    type: String,
    enum: ["job", "studium"],
    required: true,
  },
  steps: [StepSchema],
  // 🔥 Liên kết tới model AloWorkUser
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AloWorkUser",
  },
  // 🔥 Liên kết tới model Referrals
  referrals: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Referrals",
  },


});

const Programm = mongoose.model("Programm", ProgrammSchema);
module.exports = Programm; // ✅ xuất đúng
