// fixQA.js
const mongoose = require("mongoose");
const Programm = require("../model/Programm"); // Đường dẫn tới file model của bạn

// 🔧 Thay bằng URL MongoDB của bạn
const MONGO_URI = "mongodb+srv://hieuhp132:hieuhp123321!@sim.tbjccsx.mongodb.net/?retryWrites=true&w=majority&appName=sim";

async function fixOne() {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");
  
    const id = "68fb23567bbe496b2aac1c14"; // 👈 ID bạn gửi ở trên
    const programm = await Programm.findById(id);
  
    if (!programm) {
      console.log("⚠️ Program not found");
      return;
    }
  
    console.log("🔍 Before fix:", programm.qa);
    programm.qa = []; // reset về mảng rỗng
    await programm.save();
    console.log("✅ QA field reset successfully");
  
    const updated = await Programm.findById(id);
    console.log("✅ After fix:", updated.qa);
  
    await mongoose.disconnect();
    console.log("🔌 Done");
  }
  
  fixOne();