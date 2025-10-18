const express = require("express");
const router = express.Router();

const {
  // USER
  getProfile,
  updateProfile,

  // REFERRALS
  makeReferralsRequests,
  getReferralsList,
  getLinkFromReferralByIdAndStatus,

  // ADMIN
  getAllUsers,
  approvedReferralsRequestsById,
  rejectedReferralsRequestsById,
  onGoingReferralsRequestsById,
  adminConfirmCompleteStep,
  adminRejectStep,  
  resetTransactions,
  resetPotentials,
  addProgramm,
  updateProgrammById,
  resetReferrals,
  pauseOrunpauseProgrammById,

  // RECRUITER
  recruiterRequestStepUpdate,

  // REPORTING
  getAllPotentialsForAdmin,
  getPotentialsForRecruiter,
  getAllTransactions,
  saveProgramm,
  unsaveProgramm,
  getSavedProgramms,
  
  
  getPosts,
  createPost,
  updatePost,
  deletePost,
  getPostsByType,
  deleteAllPosts,

} = require("../controller/AloWorkUser");

const auth = require("../middleware/auth");
const role = require("../middleware/role");
const { deleteProgrammById } = require("../controller/DB");


// ================================================================= USER =================================================================
router.get("/myprofile", auth, role(["recruiter", "candidate", "admin"]), getProfile);
router.put("/myprofile", auth, role(["recruiter", "candidate", "admin"]), updateProfile);


// ================================================================= ADMIN =================================================================
router.get("/get-all-users", auth, role(["admin"]), getAllUsers);

router.patch("/referrals/:id/approve", auth, role(["admin"]), (req, res) => {
  req.body.id = req.params.id;
  approvedReferralsRequestsById(req, res);
});
router.patch("/referrals/:id/reject", auth, role(["admin"]), (req, res) => {
  req.body.id = req.params.id;
  rejectedReferralsRequestsById(req, res);
});
router.patch("/referrals/:id/ongoing", auth, role(["admin"]), onGoingReferralsRequestsById);
// Admin phê duyệt / từ chối step
router.patch(
  "/referrals/:id/steps/:stepNumber/completed",
  auth,
  role(["admin"]),
  adminConfirmCompleteStep
);

router.patch("/referrals/:id/steps/:stepNumber/rejected", auth, role(["admin"]), adminRejectStep);
// Admin xem toàn bộ potentials
router.get("/potentials", auth, role(["admin"]), getAllPotentialsForAdmin);
// Admin xem toàn bộ transactions
router.get("/transactions", auth, role(["admin"]), getAllTransactions);
// Admin reset Transactions
router.delete("/reset-transactions", auth, role(["admin"]), resetTransactions);
// Admin reset Potentials
router.delete("/reset-potentials", auth, role(["admin"]), resetPotentials);
// Admin reset Referrals
router.delete("/reset-referrals", auth, role(["admin"]), resetReferrals);
router.post("/programm/new", auth, role(["admin"]), addProgramm);
router.patch("/programm/edit/:id", auth, role(["admin"]), updateProgrammById);
router.delete("/programm/delete/:id", auth, role(["admin"]), deleteProgrammById);
router.post("/pause-unpause-programm", auth, role(["admin"]), pauseOrunpauseProgrammById);


router.get("/posts", getPosts);
router.get("/post", getPostsByType);
router.post("/", auth, role(["recruiter"]), createPost);
router.put("/update/:id", updatePost);
router.delete("/remove/:id", deletePost);
router.delete("/posts/delete-all", auth, role(["admin"]), deleteAllPosts);




// =============================================================== RECRUITER ===============================================================
router.post("/referrals-request", auth, role(["recruiter"]), makeReferralsRequests);
router.patch("/referrals/:id/steps/:stepNumber/request", auth, role(["recruiter"]), recruiterRequestStepUpdate);
// Recruiter xem potentials của mình
router.get("/my-potentials", auth, role(["recruiter"]), getPotentialsForRecruiter);
//

// ============================================================ ADMIN & RECRUITER ==========================================================
router.get("/my-referrals", auth, role(["recruiter", "admin"]), getReferralsList);
router.get("/referrals-link/:id", auth, role(["recruiter", "admin"]), getLinkFromReferralByIdAndStatus);
router.get('/saved-programms', auth, role(["recruiter", "admin", "candidate"]), getSavedProgramms);
router.post("/save-programm", auth, role(["recruiter", "admin", "candidate"]), saveProgramm);
router.post("/unsave-programm", auth, role(["recruiter", "admin", "candidate"]), unsaveProgramm);


module.exports = router;
