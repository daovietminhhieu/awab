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
  restartProgramms,getProgrammBySlug,
  
  

  doRegister,
  doLogin,
  fillInformation,
  getProgrammByReferralId,
  addSlugIfNotExist
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

// Get all programms
router.get("/programm", getAllProgramms);

// Get programm by slug → must come BEFORE the ID route
router.get("/programm/slug/:slug", getProgrammBySlug);

// Get programm by ID → validate ObjectId first
router.get("/programm/:id", getProgrammById);

// Add new programm
router.post("/programm", addNewProgramm);

// Add slug to a programm if not exist
router.put("/programm/:id/add-slug", addSlugIfNotExist);

// Update programm by ID
router.put("/programm/:id", updateProgrammById);

// Delete programm by ID
router.delete("/programm/:id", deleteProgrammById);

// Update all programms type_category randomly
router.patch("/programm/update-all/type-category-random", updateAllProgrammsTypeCategoryRandom);

// Delete all programms
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
router.post("/upload1", upload.single("file"), supabaseCtrl.uploadFile1);
router.delete("/delete/:filename", supabaseCtrl.deleteFile);
router.get("/list", supabaseCtrl.listFiles);









module.exports = router;
