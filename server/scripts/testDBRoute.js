// --------------------------------------------- Users Part -------------------------------------------------------------

const axios = require("axios");
const { makeUserList } = require("../migrate/AloWorkUser");

const URLUsers = "http://0.0.0.0:3000/alowork/db/user";

// 📌 Test tạo mới User
async function testAddUser(data) {
  const endpoint = `${URLUsers}`;
  console.log(`➡️ Testing POST ${endpoint} ...`);
  try {
    const response = await axios.post(endpoint, data, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("✅ Add user response:", response.data);
  } catch (err) {
    console.error("❌ Error Add user:", err.response?.data || err.message);
  }
}

// 📌 Test lấy tất cả Users
async function testGetAllUsers() {
  console.log(`➡️ Testing GET ${URLUsers} ...`);
  try {
    const response = await axios.get(URLUsers);
    console.log("✅ Get all users response:", response.data);
  } catch (err) {
    console.error("❌ Error Get all users:", err.response?.data || err.message);
  }
}



// ---------------------------------------------------- Programms Part ------------------------------------------------------------------


const { makeProgrammList } = require("../migrate/Programm");


const URLProgramm = "http://0.0.0.0:3000/alowork/db/programm";

// 📌 Test tạo mới Programm
async function testAddProgramm(data) {
  const endpoint = `${URLProgramm}`;
  console.log(`➡️ Testing POST ${endpoint} ...`);
  try {
    const response = await axios.post(
      `${URLProgramm}`,
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
  const endpoint = `${URLProgramm}`
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
    const response = await axios.get(`${URLProgramm}/${id}`);
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
      `${URLProgramm}/${id}`,
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
    const response = await axios.delete(`${URLProgramm}/${id}`);
    console.log("✅ Delete programm response:", response.data);
  } catch (err) {
    console.error("❌ Error Delete programm:", err.response?.data || err.message);
  }
}

// 📌 Test cập nhật ngẫu nhiên type_category = job | studium cho toàn bộ programms
async function testRandomizeProgrammTypeCategory() {
  const endpoint = "http://0.0.0.0:3000/alowork/db/programm/update-all/type-category-random";
  console.log(`➡️ Testing PATCH ${endpoint} ...`);
  try {
    const response = await axios.patch(endpoint);
    console.log("✅ Randomize type_category response:", response.data);
  } catch (err) {
    console.error("❌ Error randomizing type_category:", err.response?.data || err.message);
  }
}


// ---------------------------------------------------- Login & SignUp Parts ------------------------------------------------------------------

const URL_LS = "http://0.0.0.0:3000/alowork/db";

async function testSignUp() {
  const endpoint = `${URL_LS}/register`;
  console.log(`➡️ Testing POST ${endpoint} (SignUp) ...`);

  try {
    const data = {
      name: "Iam Admin",
      email: `test${Date.now()}@example.com`, // random email để không bị trùng
      password: "123456",
      role: "admin", // hoặc "admin", "recruiter"
    };

    const response = await axios.post(endpoint, data, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("✅ SignUp response:", response.data);
    return data; // để login lại bằng thông tin này
  } catch (err) {
    console.error("❌ Error SignUp:", err.response?.data || err.message);
  }
}

async function testLogin(email, password) {
  const endpoint = `${URL_LS}/login`;
  console.log(`➡️ Testing POST ${endpoint} (Login) ...`);

  try {
    const response = await axios.post(
      endpoint,
      { email, password },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("✅ Login response:", response.data);
  } catch (err) {
    console.error("❌ Error Login:", err.response?.data || err.message);
  }
}
async function testCheckIfProgrammExists(id) {
  console.log(`➡️ Checking if programm with ID ${id} exists...`);
  try {
    const res = await axios.get(`${URLProgramm}/c/${id}`);
    if (res.status === 200 && res.data?.data) {
      console.log(`✅ Programm with ID ${id} exists!`);
      console.dir(res.data.data, { depth: null });
    } else {
      console.log(`⚠️ Programm with ID ${id} not found (unexpected response format).`);
    }
  } catch (err) {
    if (err.response?.status === 404) {
      console.error(`❌ Programm with ID ${id} does NOT exist (404 Not Found).`);
    } else {
      console.error(`❌ Error while checking programm ID:`, err.response?.data || err.message);
    }
  }
}


// 📌 Run all tests tuần tự
async function runTests() {

    console.log("Start Testing:   "); 
    // Users Parts -------------------------------------------------------------------------------

    //const userList = makeUserList(2);

    //for (const user of userList) {
      //await testAddUser(user);
    //}
    //await testGetAllUsers();
    await testCheckIfProgrammExists('68de7184cc72a0d5136fce9f');
    // Programms Parts ---------------------------------------------------------------------------


    // Test data
    //const programmsList = makeProgrammList(3);

    // add data to programm list
    //for(const programm of programmsList) {
    //    await testAddProgramm(programm);
    //}
    // const programm = makeProgrammList(1);
    // await testAddProgramm(programm);
    // await testGetAllProgramm();
    //await testGetProgrammById('68da02489bf91975f732b464');
    //await testUpdateProgramm('68da02489bf91975f732b464', {
    //    title: "New Title",
    //    company: "New Company",
    //    duration: "New Duration",
    //    fee: "2000 USD"
    //});
    //await testDeleteProgramm('68da02489bf91975f732b462');


    // Login & SignUp Parts ---------------------------------------------------------------------
    //const newUser = await testSignUp();
    //if (newUser?.email && newUser?.password) {
      // await testLogin(newUser.email, newUser.password);
    //}

    // await testRandomizeProgrammTypeCategory();


}

runTests();
