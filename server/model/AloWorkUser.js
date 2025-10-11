// model/AloWorkUser.js
const { default: mongoose } = require("mongoose");

const AloWorkUserSchema = new mongoose.Schema({
  name: { type: String },
  phone: { type: String },
  birth_day: { type: String },
  sex: { type: String },
  marital_status: { type: String },
  email: { type: String },
  role: { 
    type: String, 
    enum: ["admin", "recruiter", "candidate"], // chỉ cho phép 3 giá trị này
    required: true 
  },
  password: { type: String },
  bank: { type: String },
  balance: { type: Number },
  avatarImages: { type: String },

  // 🔥 Liên kết tới model Programm
  saved_programm: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Programm"
  }],
  
});

const AloWorkUser = mongoose.model("AloWorkUser", AloWorkUserSchema);
module.exports = AloWorkUser;
