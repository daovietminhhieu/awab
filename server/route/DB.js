const express = require("express");
const {
  getAllAloWorkUsers,
  getAloWorkUserById,
  addNewAloWorkUser,
  updateAloWorkUserById,
  deleteAloWorkUserById,
  restartUsers,
  setUserBalance,

  getAllProgramms,
  getProgrammById,
  addNewProgramm,
  updateProgrammById,
  deleteProgrammById,
  updateAllProgrammsTypeCategoryRandom,
  restartProgramms,
  
  

  doRegister,
  doLogin,
  fillInformation,
  getProgrammByReferralId
} = require("../controller/DB.js");

const router = express.Router();

// ================== USER ROUTES ==================
router.get("/user", getAllAloWorkUsers);
router.get("/user/:id", getAloWorkUserById);
router.post("/user", addNewAloWorkUser);
router.put("/user/:id", updateAloWorkUserById);
router.delete("/user/:id", deleteAloWorkUserById);
router.delete("/user/restart/all", restartUsers);

// ================== PROGRAMM ROUTES ==================
router.get("/programm", getAllProgramms);
router.get("/programm/:id", getProgrammById);
router.post("/programm", addNewProgramm);
router.put("/programm/:id", updateProgrammById);
router.delete("/programm/:id", deleteProgrammById);
router.patch("/programm/update-all/type-category-random", updateAllProgrammsTypeCategoryRandom);

router.delete("/programm/restart/all", restartProgramms);


// ================== Referral Programm Routes ==================
router.get("/programm/c/:id", getProgrammByReferralId)
router.post("/programm/c/:id/fill", fillInformation);


// =================== Login && SignIp ==================
router.post("/register", doRegister);
router.post("/login", doLogin);


const auth = require('../middleware/auth.js');
const role = require('../middleware/role.js');
router.post("/set-balance", auth, role(["system"]), setUserBalance);


// =================== Supabase =========================
const supabaseCtrl = require("../controller/Supabase.js");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload route
router.post("/upload", upload.single("file"), supabaseCtrl.uploadFile);
router.delete("/delete/:filename", supabaseCtrl.deleteFile);
router.get("/list", supabaseCtrl.listFiles);









module.exports = router;
