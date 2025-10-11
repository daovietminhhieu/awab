const axios = require("axios");
const { makeProgrammList } = require("../migrate/Programm");


const URL = "http://0.0.0.0:3000/alowork/db/programm";

// 📌 Test tạo mới Programm
async function testAddProgramm(data) {
  const endpoint = `${URL}`;
  console.log(`➡️ Testing POST ${endpoint} ...`);
  try {
    const response = await axios.post(
      `${URL}/add`,
      data,
      { headers: { "Content-Type": "application/json" } }
    );
    console.log("✅ Add programm response:", response.data);
  } catch (err) {
    console.error("❌ Error Add programm:", err.response?.data || err.message);
  }
}

// 📌 Test lấy tất cả Programms
async function testGetAllProgramm() {
  const endpoint = `${URL}`
  console.log(`➡️ Testing GET ${endpoint} ...`);
  try {
    const response = await axios.get(endpoint);
    console.log("✅ Get all programms response:", response.data);
  } catch (err) {
    console.error("❌ Error Get all programms:", err.response?.data || err.message);
  }
}

// 📌 Test lấy Programm theo ID
async function testGetProgrammById(id) {
  console.log("➡️ Testing GET /programm/:id ...");
  try {
    const response = await axios.get(`${URL}/${id}`);
    console.log("✅ Get programm by ID response:", response.data);
  } catch (err) {
    console.error("❌ Error Get programm by ID:", err.response?.data || err.message);
  }
}

// 📌 Test cập nhật Programm theo ID
async function testUpdateProgramm(id, updates) {
  console.log("➡️ Testing PUT /programm/:id ...");
  try {
    const response = await axios.put(
      `${URL}/${id}`,
      updates, 
      { headers: { "Content-Type": "application/json" } }
    );
    console.log("✅ Update programm response:", response.data);
  } catch (err) {
    console.error("❌ Error Update programm:", err.response?.data || err.message);
  }
}

// 📌 Test xóa Programm theo ID
async function testDeleteProgramm(id) {
  console.log("➡️ Testing DELETE /programm/:id ...");
  try {
    const response = await axios.delete(`${URL}/${id}`);
    console.log("✅ Delete programm response:", response.data);
  } catch (err) {
    console.error("❌ Error Delete programm:", err.response?.data || err.message);
  }
}


// 📌 Run all tests tuần tự
async function runTests() {

    // Test data
    //const programmsList = makeProgrammList(3);

    // add data to programm list
    //for(const programm of programmsList) {
    //    await testAddProgramm(programm);
    //}

    await testGetAllProgramm();
    //await testGetProgrammById('68da02489bf91975f732b464');
    //await testUpdateProgramm('68da02489bf91975f732b464', {
    //    title: "New Title",
    //    company: "New Company",
    //    duration: "New Duration",
    //    fee: "2000 USD"
    //});
    //await testDeleteProgramm('68da02489bf91975f732b462');

}

runTests();
