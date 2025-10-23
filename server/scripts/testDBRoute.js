/**
 * 🧩 Seed dữ liệu Programms vào MongoDB qua API
 * Author: ChatGPT
 */

const fetch = global.fetch || require("node-fetch");
const { makeProgrammList } = require("../migrate/Programm"); // 👈 file mock bạn đã có
const BASE_URL = "http://0.0.0.0:3000/alowork/db/programm";

// ======================
// ⚙️ API Helper Functions
// ======================

async function deleteAllProgramms() {
  console.log(`➡️ DELETE ${BASE_URL}/restart/all`);
  try {
    const res = await fetch(`${BASE_URL}/restart/all`, { method: "DELETE" });
    const data = await res.json();
    console.log("✅ Đã xóa toàn bộ Programms:", data);
  } catch (err) {
    console.error("❌ Lỗi khi xóa dữ liệu:", err.message);
  }
}

async function createProgramm(programm) {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(programm),
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("❌ Server trả về không phải JSON:", text);
      return null;
    }

    if (!response.ok) throw new Error(data.error || "Lỗi khi tạo Programm");
    return data;
  } catch (err) {
    console.error("❌ Lỗi khi tạo Programm:", err.message);
    return null;
  }
}

async function listProgramms() {
  console.log(`➡️ GET ${BASE_URL}`);
  try {
    const res = await fetch(BASE_URL);
    const data = await res.json();
    console.log(`✅ Có ${data.length || 0} chương trình trong DB.`);
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách:", err.message);
  }
}

// ======================
// 🚀 Seed Main Function
// ======================

(async () => {
  console.log("🧩 Bắt đầu seed dữ liệu Programms ...");

  // 1️⃣ Xóa dữ liệu cũ
  await deleteAllProgramms();

  // 2️⃣ Tạo danh sách mới
  const programms = makeProgrammList(10); // tạo 10 chương trình mẫu
  console.log(`➡️ Tạo ${programms.length} Programms mẫu.`);

  // 3️⃣ Gửi tuần tự từng Programm lên API
  for (const [index, p] of programms.entries()) {
    const result = await createProgramm(p);
    if (result) console.log(`✅ ${index + 1}/${programms.length} - Đã thêm: ${p.title}`);
  }

  // 4️⃣ Kiểm tra kết quả
  await listProgramms();

  console.log("🎉 Hoàn tất seed dữ liệu Programms!");
})();
