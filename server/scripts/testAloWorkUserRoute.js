const axios = require("axios");
const { makeProgrammList, makeProgramm } = require("../migrate/Programm.js");

const BASE_URL = "http://localhost:3000/alowork/user";
const DB_URL = "http://localhost:3000/alowork/db";
const LOGIN_URL = `${DB_URL}/login`;
const REGISTER_URL = `${DB_URL}/register`;

// 👤 Credential test
const credential = {
  admin: { email: "test1759332588071@example.com", password: "123456" },
  recruiter: { email: "test1759201258532@example.com", password: "123456" },
  candidate: {
    email: "candidate@example.com",
    password: "123456",
    name: "Candidate InSystem",
    role: "candidate",
  },
};

// ====================== HELPERS ======================
async function getToken(role) {
  const res = await axios.post(LOGIN_URL, credential[role]);
  return res.data.token;
}

async function registerCandidateIfNotExists() {
  try {
    await axios.post(REGISTER_URL, credential.candidate);
    console.log("✅ Candidate registered");
  } catch (err) {
    if (err.response?.data?.message?.includes("exists")) {
      console.log("ℹ️ Candidate already exists");
    } else throw err;
  }
}

async function addNewProgrammAndReturnId() {
  const programm = makeProgrammList(1);
  const res = await axios.post(`${DB_URL}/programm`, programm);
  return res.data.data[0]._id;
}

// 🧩 Utility: fetch referral info
async function getReferralStatus(referralId, token) {
  const res = await axios.get(`${BASE_URL}/my-referrals`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data.find((r) => r._id === referralId);
}

// ====================== REFERRAL FLOW ACTIONS ======================
async function createReferral(recruiterToken, adminId, programmId) {
  const res = await axios.post(
    `${BASE_URL}/referrals-request`,
    { admin: adminId, programm: programmId },
    { headers: { Authorization: `Bearer ${recruiterToken}` } }
  );
  console.log("✅ Referral created:", res.data.data._id);
  return res.data.data._id;
}

async function approveReferral(adminToken, referralId) {
  await axios.patch(
    `${BASE_URL}/referrals/${referralId}/approve`,
    {},
    { headers: { Authorization: `Bearer ${adminToken}` } }
  );
  console.log("✅ Referral approved");
}

async function rejectReferral(adminToken, referralId) {
  await axios.patch(
    `${BASE_URL}/referrals/${referralId}/reject`,
    {},
    { headers: { Authorization: `Bearer ${adminToken}` } }
  );
  console.log("❌ Referral rejected (by admin)");
}

async function setReferralOngoing(adminToken, referralId) {
  await axios.patch(
    `${BASE_URL}/referrals/${referralId}/ongoing`,
    {},
    { headers: { Authorization: `Bearer ${adminToken}` } }
  );
  console.log("✅ Referral set to ongoing with steps");
}

async function recruiterRequestStep(recruiterToken, referralId, stepNumber) {
  await axios.patch(
    `${BASE_URL}/referrals/${referralId}/steps/${stepNumber}/request`,
    {},
    { headers: { Authorization: `Bearer ${recruiterToken}` } }
  );
  console.log(`📤 Recruiter submitted step ${stepNumber} for review`);
}

async function adminApproveStep(adminToken, referralId, stepNumber) {
  await axios.patch(
    `${BASE_URL}/referrals/${referralId}/steps/${stepNumber}/completed`,
    {},
    { headers: { Authorization: `Bearer ${adminToken}` } }
  );
  console.log(`✅ Admin approved step ${stepNumber}`);
}

async function adminRejectStep(adminToken, referralId, stepNumber) {
  await axios.patch(
    `${BASE_URL}/referrals/${referralId}/steps/${stepNumber}/reject`,
    {},
    { headers: { Authorization: `Bearer ${adminToken}` } }
  );
  console.log(`❌ Admin rejected step ${stepNumber}`);
}

async function candidateApply(candidateToken, referralId) {
  const res = await axios.get(`${DB_URL}/programm/c/${referralId}`, {
    headers: { Authorization: `Bearer ${candidateToken}` },
  });
  console.log("👤 Candidate applied in-system:", res.data);
}

// ====================== TEST CASES ======================
async function case1_completedFlow(adminToken, recruiterToken, candidateToken, adminId) {
  console.log("\n===== CASE 1: FULLY COMPLETED FLOW =====");

  const programmId = await addNewProgrammAndReturnId();
  const referralId = await createReferral(recruiterToken, adminId, programmId);

  await approveReferral(adminToken, referralId);
  await candidateApply(candidateToken, referralId);
  await setReferralOngoing(adminToken, referralId);

  for (let step = 1; step <= 3; step++) {
    await recruiterRequestStep(recruiterToken, referralId, step);
    await adminApproveStep(adminToken, referralId, step);
  }

  const finalReferral = await getReferralStatus(referralId, recruiterToken);
  console.log("🏁 Final Referral Status:", finalReferral.status);
}

async function case2_rejectedAtStep(adminToken, recruiterToken, candidateToken, adminId) {
  console.log("\n===== CASE 2: ADMIN REJECTS AT STEP 2 =====");

  const programmId = await addNewProgrammAndReturnId();
  const referralId = await createReferral(recruiterToken, adminId, programmId);

  await approveReferral(adminToken, referralId);
  await candidateApply(candidateToken, referralId);
  await setReferralOngoing(adminToken, referralId);

  await recruiterRequestStep(recruiterToken, referralId, 1);
  await adminApproveStep(adminToken, referralId, 1);

  await recruiterRequestStep(recruiterToken, referralId, 2);
  await adminRejectStep(adminToken, referralId, 2);

  const finalReferral = await getReferralStatus(referralId, recruiterToken);
  console.log("🚫 Referral Final Status:", finalReferral.status);
}

async function case3_rejectedAtRequest(adminToken, recruiterToken, adminId) {
  console.log("\n===== CASE 3: ADMIN REJECTS REFERRAL REQUEST DIRECTLY =====");

  const programmId = await addNewProgrammAndReturnId();
  const referralId = await createReferral(recruiterToken, adminId, programmId);

  await rejectReferral(adminToken, referralId);

  const finalReferral = await getReferralStatus(referralId, recruiterToken);
  console.log("🚫 Referral Final Status:", finalReferral.status);
}

async function case4_pendingOnly(recruiterToken, adminId) {
  console.log("\n===== CASE 4: REFERRAL STAYS PENDING =====");

  const programmId = await addNewProgrammAndReturnId();
  const referralId = await createReferral(recruiterToken, adminId, programmId);

  const finalReferral = await getReferralStatus(referralId, recruiterToken);
  console.log("⏳ Referral Final Status:", finalReferral.status);
}

async function case5_reporting(adminToken, recruiterToken) {
  console.log("\n===== CASE 5: REPORTING DASHBOARD =====");

  // Recruiter xem potentials của mình
  const myPotentials = await axios.get(`${BASE_URL}/my-potentials`, {
    headers: { Authorization: `Bearer ${recruiterToken}` }
  });
  console.log(`📊 Recruiter Potentials: ${myPotentials.data.data.length}`);
  console.dir(myPotentials.data.data, { depth: null, colors: true }); // 👀 in chi tiết

  // Admin xem tất cả potentials
  const allPotentials = await axios.get(`${BASE_URL}/potentials`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log(`📊 Admin Potentials: ${allPotentials.data.data.length}`);
  console.dir(allPotentials.data.data, { depth: null, colors: true });

  // Admin xem tất cả transactions
  const transactions = await axios.get(`${BASE_URL}/transactions`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log(`📊 Admin Transactions: ${transactions.data.data.length}`);
  console.dir(transactions.data.data, { depth: null, colors: true });
}


// ====================== RESET TEST ======================
async function case6_resetData(adminToken) {
  console.log("\n===== CASE 6: RESET DATA =====");

  // reset transactions
  const resetTx = await axios.delete(`${BASE_URL}/reset-transactions`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log(`🗑️ Reset Transactions: ${resetTx.data.message}`);

  // reset potentials
  const resetPot = await axios.delete(`${BASE_URL}/reset-potentials`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log(`🗑️ Reset Potentials: ${resetPot.data.message}`);

  // const resetProgs = await axios.delete(`${DB_URL}/programm/restart/all`);
  // console.log(`Reset Programms: ${resetProgs.data.message}`);

  const resetReferrals = await axios.delete(`${BASE_URL}/reset-referrals`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log(`🗑️ Reset Potentials: ${resetReferrals.data.message}`);

}

// ====================== PROGRAMM ACTIONS ======================
async function addNewProgramm(programm, adminToken) {
  const res = await axios.post(`${BASE_URL}/programm/new`, programm, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log(`📋 All Programms: ${res.data.data.length}`);
  return res.data.data;
}

async function editProgrammById(id, updates, adminToken) {
  const res = await axios.patch(`${BASE_URL}/programm/edit/${id}`, updates, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  return res.data.data;
}
async function getAllProgramms() {
  const res = await axios.get(`${DB_URL}/programm`);
  console.log(`📋 All Programms: ${res.data.data.length}`);
  console.log(res.data.data);
  return res.data.data;
}

async function getProgrammById(id) {
  const res = await axios.get(`${DB_URL}/programm/${id}`);
  console.log("🔍 Get Programm by ID:", res.data.data._id);
  return res.data.data;
}
async function deleteProgramm(id, adminToken) {
  const res = await axios.delete(`${BASE_URL}/programm/delete/${id}`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log("🗑️ Deleted Programm:", res.data.message);
}

async function case7_iterationWithProgramm(adminToken) {
  console.log("\n===== CASE 7: PROGRAMM CRUD =====");

  // 1. Create
  const programm = makeProgramm();
  console.log("New programm created: " + programm);
  const newProgramm = await addNewProgramm(programm, adminToken);

  // 2. Get All
  const all = await getAllProgramms();
  if (!all.find(p => p._id === newProgramm._id)) {
    console.error("❌ New programm not found in list!");
  }

  // 3. Get by ID
  const fetched = await getProgrammById(newProgramm._id);
  if (fetched._id !== newProgramm._id) {
    console.error("❌ Get by ID mismatch!");
  }

  // 4. Update
  const updated = await editProgrammById(newProgramm._id, { title: "Updated Programm" }, adminToken);
  if (updated.title !== "Updated Programm") {
    console.error("❌ Programm not updated!");
  }

  // 5. Delete
  await deleteProgramm(newProgramm._id, adminToken);

  console.log("✅ Programm CRUD flow completed");
}


// Lưu chương trình cho user
async function saveProgramm(progId, token) {
  const res = await axios.post(
    `${BASE_URL}/save-programm`,
    { programmId: progId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  console.log("✅ Programm saved:", res.data.message || res.data);
  return res.data;
}

// Bỏ lưu chương trình
async function unsaveProgramm(progId, token) {
  const res = await axios.post(
    `${BASE_URL}/unsave-programm`,
    { programmId: progId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  console.log("✅ Programm unsaved:", res.data.message || res.data);
  return res.data;
}

async function getSavedProgramms(token) {
  const res = await axios.get(`${BASE_URL}/saved-programms`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const saved = res.data.data || [];
  console.log(`📋 Saved programms (${saved.length}):`, saved);
  return saved;
}



async function testSaveUnsaveProgramm(candidateToken) {
  console.log("\n===== TEST SAVE / UNSAVE / GET SAVED PROGRAM =====");

  // // 1. Thêm chương trình mới
  const newProgramm = await addNewProgrammAndReturnId();

  console.log("start save programm");
  // 2. Save programm
  await saveProgramm(newProgramm, candidateToken);
  console.log("end.");

  // 3. Lấy danh sách programm đã lưu, kiểm tra có tồn tại
  console.log("start get saved list");
  let savedList = await getSavedProgramms(candidateToken);
  if (!savedList.find(p => p._id === newProgramm)) {
    console.error("❌ Programm chưa được lưu!");
  } else {
    console.log("✅ Programm đã lưu xuất hiện trong danh sách saved");
  }
  console.log("end..");



  // 4. Unsave programm
  console.log("start unsave programm");
  await unsaveProgramm(newProgramm, candidateToken);
  console.log("end...");
  // 5. Lấy lại danh sách programm đã lưu, kiểm tra đã bị xoá
  console.log("start get saved list");
  savedList = await getSavedProgramms(candidateToken);
  if (savedList.find(p => p._id === newProgramm)) {
    console.error("❌ Programm chưa được bỏ lưu!");
  } else {
    console.log("✅ Programm đã được bỏ lưu thành công");
  }
  console.log("end....");
  // 6. Xoá programm test để dọn dẹp
  //await deleteProgramm(newProgramm, adminToken);
}




// ====================== RUN ALL TESTS ======================
async function runTests() {
  console.log("🚀 Running referral flow coverage tests...");

  const adminToken = await getToken("admin");
  const recruiterToken = await getToken("recruiter");
  await registerCandidateIfNotExists();
  const candidateToken = await getToken("candidate");
  const adminId = "68dd453474c74157fa7bc221"; // ⚠️ thay bằng adminId thật trong DB

  //await case1_completedFlow(adminToken, recruiterToken, candidateToken, adminId);
  // await case2_rejectedAtStep(adminToken, recruiterToken, candidateToken, adminId);
  // await case3_rejectedAtRequest(adminToken, recruiterToken, adminId);
  // await case4_pendingOnly(recruiterToken, adminId);
  
  // await case6_resetData(adminToken);
  // await case5_reporting(adminToken, recruiterToken); 
  
  // await getAllProgramms();
  // await case7_iterationWithProgramm(adminToken);
  await testSaveUnsaveProgramm(adminToken);


  console.log("\n✅ All test cases executed!");

}

runTests().catch((err) => {
  console.error("❌ Test flow failed:", err.response?.data || err.message);
});
