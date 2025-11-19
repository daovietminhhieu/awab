/**
 * 🧩 testDBRoute.js - FIXED VERSION
 */
const fetch = global.fetch || require("node-fetch");
const BASE_URL = "http://0.0.0.0:3000/alowork/db/programm";

// ======================
// ⚙️ API Helper Functions - FIXED
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
    return data.data || [];
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách:", err.message);
    return [];
  }
}

async function addSlugIfNotExist(programmId) {
  console.log(`➡️ PUT ${BASE_URL}/${programmId}/add-slug`);
  try {
    const res = await fetch(`${BASE_URL}/${programmId}/add-slug`, {
      method: "PUT",
    });

    const data = await res.json();
    console.log("🔧 Kết quả addSlugIfNotExist:", data);
    return data;
  } catch (err) {
    console.error("❌ Lỗi khi gọi addSlugIfNotExist:", err.message);
    return null;
  }
}

// FIXED: Correct endpoint for slug lookup
async function getProgrammBySlug(slug) {
  const url = `${BASE_URL}/slug/${slug}`;
  console.log(`➡️ GET ${url}`);
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log("🔧 Kết quả getProgrammBySlug:", data);
    return data;
  } catch (err) {
    console.error("❌ Lỗi khi gọi getProgrammBySlug:", err.message);
    return null;
  }
}

// ============= MAIN SCRIPT ============= //

(async () => {
  console.log("🧩 Bắt đầu test thêm slug cho tất cả Programms trong DB...");

  // 1️⃣ Lấy danh sách programm trong DB
  const existingProgramms = await listProgramms();
  console.log("📌 Tìm thấy", existingProgramms.length, "Programms trong DB.");

  if (!existingProgramms.length) {
    console.log("⚠️ Không có programm nào trong DB → dừng lại.");
    return;
  }

  // 2️⃣ Test getProgrammBySlug với slug cụ thể
  const slug = 'ausbildung-fachkraft-fur-gastronomie-m-w-d-schwerpunkt-systemgastronomie';
  console.log(`\n🔍 Testing getProgrammBySlug với slug: "${slug}"`);
  const result = await getProgrammBySlug(slug);

  // 3️⃣ Test với tất cả programms có slug
  console.log(`\n🔍 Testing getProgrammBySlug với tất cả programms:`);
  for (const programm of existingProgramms) {
    if (programm.slug) {
      console.log(`\n📝 Testing slug: "${programm.slug}"`);
      await getProgrammBySlug(programm.slug);
    }
  }

  console.log("\n🎉 Hoàn tất test addSlugIfNotExist!");
})();