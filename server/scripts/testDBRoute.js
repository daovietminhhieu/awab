const fs = require("fs");
const path = require("path");
const { Blob } = require("buffer");
const fetch = global.fetch || require("node-fetch"); // fallback nếu Node <18

const BASE_URL = "http://0.0.0.0:3000/alowork/db";

/**
 * 🧪 Upload file lên Supabase Storage
 */
async function testUploadFile(filePath) {
  console.log(`➡️ Testing POST ${BASE_URL}/upload (Upload File) ...`);

  try {
    const formData = new FormData();
    const buffer = fs.readFileSync(filePath);
    const blob = new Blob([buffer], { type: "image/jpeg" });
    formData.append("file", blob, path.basename(filePath));

    const response = await fetch(`${BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("❌ Server không trả JSON, trả:", text.slice(0, 200));
      return;
    }

    if (!response.ok) throw new Error(data.error || "Upload failed");
    console.log("✅ Upload file response:", data);
    return data.publicUrl;
  } catch (err) {
    console.error("❌ Error Upload file:", err.message);
  }
}

/**
 * 📋 Liệt kê danh sách file
 */
async function testListFiles() {
  console.log(`➡️ Testing GET ${BASE_URL}/list ...`);

  try {
    const response = await fetch(`${BASE_URL}/list`);
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("❌ Server không trả JSON, trả:", text.slice(0, 200));
      return;
    }

    if (!response.ok) throw new Error(data.error || "List files failed");
    console.log("✅ List files response:", data);
  } catch (err) {
    console.error("❌ Error List files:", err.message);
  }
}

/**
 * 🗑️ Xóa file theo tên
 */
async function testDeleteFile(filename) {
  console.log(`➡️ Testing DELETE ${BASE_URL}/delete/${filename} ...`);
  try {
    const response = await fetch(`${BASE_URL}/delete/${filename}`, {
      method: "DELETE",
    });
    const data = await response.json();

    if (!response.ok) throw new Error(data.error || "Delete failed");
    console.log("✅ Delete file response:", data);
  } catch (err) {
    console.error("❌ Error Delete file:", err.message);
  }
}

/**
 * 🚀 Chạy toàn bộ test
 */
async function runTests() {
  console.log("Start Supabase Tests...");

  console.log(path.resolve("."));
  const localFilePath = path.resolve("./scripts/bg.jpg");

  // 1️⃣ Upload file
  const publicUrl = await testUploadFile(localFilePath);

  // 2️⃣ Lấy danh sách file
  await testListFiles();

  // 3️⃣ Xóa file (nếu upload thành công)
  // if (publicUrl) {
  //   const filename = publicUrl.split("/").pop();
  //   await testDeleteFile(filename);
  // }

  console.log("✅ Supabase test completed.");
}

runTests();
