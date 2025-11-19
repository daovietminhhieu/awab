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
  deleteReferralsWithNullCandidate,
  addProgramm,
  updateProgrammById,
  resetReferrals,
  pauseOrunpauseProgrammById,
  updateProgrammReview, answerProgrammQA,
  getProgrammQaList, sendProgrammQA,
  // RECRUITER
  recruiterRequestStepUpdate,

  // REPORTING
  getAllPotentialsForAdmin,
  getPotentialsForRecruiter,
  getAllTransactions,
  saveProgramm,
  unsaveProgramm,
  getSavedProgramms,
  
  
  getPosts,getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostsByType,
  deleteAllPosts,
  
  getCosts,
  addCost,
  updateCost,
  deleteCost,
  
  addDocument,
  updateDocument,
  deleteDocument,
  getDocuments,
  getSteps,
  addStep,
  updateStep,
  deleteStep,
  
  getReferralBySlug,
  addSlugForPostIfNotExist,
  getPostBySlug,

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
router.patch("/referrals/:id/reject", auth, role(["admin"]), async (req, res) => {
  try {
    console.log("📩 PATCH /referrals/:id/reject called with id =", req.params.id);
    await rejectedReferralsRequestsById(req, res, req.params.id);
  } catch (err) {
    console.error("🔥 Error in reject route:", err);
    res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
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
// router.delete("/referrals/remove/:id", auth, role(["admin"]), removeReferralById);
// router.post("/referrals/update/:id", auth, role(["admin","recruiter"], updateReferralById));
// Admin xem toàn bộ potentials
router.get("/potentials", auth, role(["admin"]), getAllPotentialsForAdmin);
// Admin xem toàn bộ transactions
router.get("/transactions", auth, role(["admin"]), getAllTransactions);
// Admin reset Transactions
router.delete("/reset-transactions", auth, role(["admin"]), resetTransactions);
// Admin reset Potentials
router.delete("/reset-potentials", auth, role(["admin","recruiter"]), resetPotentials);
// Admin reset Referrals
router.delete("/reset-referrals", auth, role(["admin"]), resetReferrals);
// Admin delete referrals where candidate is null
router.delete("/referrals/delete-empty-candidate", auth, role(["admin"]), deleteReferralsWithNullCandidate);

// === CRUD Steps ===
router.get("/programm/:id/steps", getSteps);
router.post("/programm/:id/steps", auth, role(["admin"]), addStep);
router.put("/programm/:id/steps/:stepId", auth, role(["admin"]), updateStep);
router.delete("/programm/:id/steps/:stepId", auth, role(["admin"]), deleteStep);

router.post("/programm/new", auth, role(["admin"]), addProgramm);
router.patch("/programm/edit/:id", auth, role(["admin"]), updateProgrammById);
router.delete("/programm/delete/:id", auth, role(["admin"]), deleteProgrammById);
router.post("/pause-unpause-programm", auth, role(["admin"]), pauseOrunpauseProgrammById);

router.patch("/programm/:id/review", updateProgrammReview);
router.post("/:id/sendQa", sendProgrammQA);
router.get("/:id/qaList", getProgrammQaList);
router.post("/:id/qa/:qaId/answer", auth, role(["admin","recruiter"]), answerProgrammQA);

// COSTS
router.get("/programm/:id/costs", getCosts);
router.post("/programm/:id/costs", auth, role(["admin"]), addCost);
router.put("/programm/:id/costs/:costId", auth, role(["admin"]), updateCost);
router.delete("/programm/:id/costs/:costId", auth, role(["admin"]), deleteCost);

// DOCUMENTS
router.get("/programm/:id/documents", getDocuments);
router.post("/programm/:id/documents", auth, role(["admin"]), addDocument);
router.put("/programm/:id/documents/:docId", auth, role(["admin"]), updateDocument);
router.delete("/programm/:id/documents/:docId", auth, role(["admin"]), deleteDocument);

router.get("/posts", getPosts);
router.get("/post", getPostsByType);
router.get("/post/:id", getPostById);
router.get("/post/slug/:slug", getPostBySlug); // Thêm route lấy post bằng slug
router.post("/post/", auth, role(["admin"]), createPost);
router.put("/post/update/:id", updatePost);
router.put("/post/:id/add-slug", addSlugForPostIfNotExist); // Thêm route add slug
router.delete("/post/remove/:id", deletePost);
router.delete("/posts/delete-all", auth, role(["admin"]), deleteAllPosts);




// =============================================================== RECRUITER ===============================================================
router.post("/referrals-request", auth, role(["recruiter"]), makeReferralsRequests);
router.get("/referrals/:slug", getReferralBySlug);
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
