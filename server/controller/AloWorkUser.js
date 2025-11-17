const AloWorkUser = require("../model/AloWorkUser");
const Referrals = require("../model/Referrals");
const Potential = require("../model/Potential");
const Programm = require("../model/Programm");
const jwt = require('jsonwebtoken');
// ------------------------------- HELPERS -------------------------------

// Tạo response chuẩn
const respond = (res, status, success, message, data = null) => {
  return res.status(status).json({ success, message, data });
};

// Lấy referral theo id (populate đầy đủ)
const findReferralById = async (id) => {
  try {
    return await Referrals.findById(id).populate("programm recruiter candidate admin");
  } catch (err) {
    console.error("❌ findReferralById error:", err);
    return null;
  }
};

// ------------------------------- USER ROUTES -------------------------------
const getProfile = async (req, res) => {
  try {
    console.log("🔍 getProfile req.user:", req.user);

    const user = await AloWorkUser.findById(req.user.id).select("-password").lean();


    if (!user) return respond(res, 404, false, "User not found");

    const profile = {
      _id: user._id,
      name: user.name || null,
      birth_day: user.birth_day || null,
      sex: user.sex || null,
      marital_status: user.marital_status || null,
      email: user.email || null,
      role: user.role || null,
      bank: user.bank || null,
      balance: user.balance ?? null,
      avatarImages: user.avatarImages || null,
      my_programm: user.my_programm || null,
    };

    return respond(res, 200, true, "Profile fetched successfully", profile);
  } catch (err) {
    return respond(res, 500, false, "Server error", err.message);
  }
};

const updateProfile = async (req, res) => {
  try {
    console.log("UpdateProfile body:", req.body);

    const user = await AloWorkUser.findById(req.user.id);
    if (!user) return respond(res, 404, false, "User not found");

    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.password) user.password = req.body.password;

    await user.save();

    const newToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    return respond(res, 200, true, "Profile updated successfully", {
      user,
      token: newToken,
    });
  } catch (err) {
    console.error("❌ Update profile error:", err);
    return respond(res, 400, false, "Update failed", err.message || err);
  }
};


const getReferralsList = async (req, res) => {
  try {
    let referrals;
    const { role, id } = req.user;

    if (role === "admin") {
      referrals = await Referrals.find().populate("admin recruiter programm candidate");
    } else if (role === "recruiter") {
      referrals = await Referrals.find({ recruiter: id }).populate("admin programm candidate");
    } else {
      return respond(res, 403, false, "Forbidden");
    }

    return respond(res, 200, true, "Referrals fetched successfully", referrals);
  } catch (err) {
    return respond(res, 500, false, "Server error", err.message);
  }
};

const saveProgramm = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const { programmId } = req.body;

    if (!programmId) {
      return res.status(400).json({ message: "Missing programmId" });
    }

    const user = await AloWorkUser.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Nếu chưa lưu program này, thêm vào mảng
    if (!user.saved_programm.includes(programmId)) {
      user.saved_programm.push(programmId);
      await user.save();
    }

    return res.status(200).json({ message: "Programm saved successfully", saved_programm: user.saved_programm });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const unsaveProgramm = async (req, res) => {
  try {
    const userId = req.user.id;
    const { programmId } = req.body;

    if (!programmId) {
      return res.status(400).json({ message: "Missing programmId" });
    }

    const user = await AloWorkUser.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hasProgram = user.saved_programm.some(
      id => id.toString() === programmId.toString()
    );

    if (!hasProgram) {
      return res.status(400).json({ message: "Program not found in saved list" });
    }

    // ✅ FIX: chuyển id về string trước khi so sánh
    user.saved_programm = user.saved_programm.filter(
      id => id.toString() !== programmId.toString()
    );

    await user.save();

    return res.status(200).json({
      message: "Programm unsaved successfully",
      saved_programm: user.saved_programm,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};


const getSavedProgramms = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await AloWorkUser.findById(userId).populate('saved_programm');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ data: Array.isArray(user.saved_programm) ? user.saved_programm : [] });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


/**
 * Recruiter tạo referral — auto-approved & có link ngay
 */
const makeReferralsRequests = async (req, res) => {
  try {
    const { programm, admin } = req.body;

    // Validate
    if (!programm) return respond(res, 400, false, "Programm is required");
    if (!req.user?.id) return respond(res, 401, false, "Unauthorized user");

    // 1️⃣ Tạo referral mới
    const referral = new Referrals({
      admin: admin || null,
      recruiter: req.user.id,
      candidate: null,
      programm,
      status: "waiting_candidate",  // 
      link: "",            // sẽ cập nhật sau khi có _id
    });

    await referral.save();

    // 2️⃣ Cập nhật link referral ngay sau khi có _id
    referral.link = `https://awa-gjr9.onrender.com/programm-view/candidate-apply/${referral._id}`;
    await referral.save();

    // 3️⃣ Lấy bản đầy đủ có populate (programm, recruiter, v.v.)
    const populatedReferral = await findReferralById(referral._id);

    return respond(res, 200, true, "Referral created and approved successfully", populatedReferral);

  } catch (err) {
    console.error("❌ Error creating referral:", err);
    return respond(res, 500, false, "Server error", err.message);
  }
};

// recruiter yêu cầu update step
const recruiterRequestStepUpdate = async (req, res) => {
  try {
    const { stepNumber } = req.params;
    const referral = await Referrals.findById(req.params.id);
    if (!referral) return respond(res, 404, false, "Referral not found");

    //const stepNum = Number(stepNumber)
    const step = referral.steps.find((s) => s.step == stepNumber);
    if (!step) return respond(res, 400, false, "Invalid step");

    if (step.status !== "pending") {
      return respond(res, 400, false, "Step already in review or completed");
    }

    step.status = "in_review";
    step.requestedBy = req.user.id;
    step.updatedAt = new Date();

    await referral.save();
    return respond(res, 200, true, "Step submitted for review", referral.steps);
  } catch (err) {
    return respond(res, 500, false, "Server error", err.message);
  }
};

const getPotentialsForRecruiter = async (req, res) => {
  try {
    const potentials = await Potential.find({ recruiter: req.user.id }).populate("candidate programm referral");
    return respond(res, 200, true, "Recruiter potentials fetched successfully", potentials);
  } catch (err) {
    return respond(res, 500, false, "Server error", err.message);
  }
};

// ------------------------------- GET LINK -------------------------------
const getLinkFromReferralByIdAndStatus = async (req, res) => {
  try {
    const referral = await findReferralById(req.params.id);
    if (!referral) {
      return respond(res, 404, false, "Referral not found");
    }

    if (referral.status === "pending") {
      return respond(res, 200, true, "Referral is still pending. Need confirm from admin first", {
        status: referral.status,
      });
    }

    // For all other statuses, send link and status
    return respond(res, 200, true, "Referral link", {
      status: referral.status,
      link: referral.link || null,
    });

  } catch (err) {
    return respond(res, 500, false, "Server error", err.message);
  }
};

// ------------------------------ ADMIN ROUTES ------------------------------
const getAllUsers = async (req, res) => {
  try {
    const users = await AloWorkUser.find();
    return respond(res, 200, true, "Users fetched successfully", users);
  } catch (err) {
    return respond(res, 500, false, "Server error", err.message);
  }
};


const rejectedReferralsRequestsById = async (req, res, idParam) => {
  try {
    const id = idParam || req.body.id; // ưu tiên param
    const referral = await findReferralById(id);
    if (!referral) return respond(res, 404, false, "Referral not found");

    referral.status = "rejected";
    await referral.save();

    return respond(res, 200, true, "Referral rejected successfully", referral);
  } catch (err) {
    console.error("🔥 [RejectReferral] Error:", err);
    return respond(res, 500, false, "Server error", err.message);
  }
};


const onGoingReferralsRequestsById = async (req, res) => {
  try {
    const referral = await findReferralById(req.params.id);
    if (!referral) return respond(res, 404, false, "Referral not found");

    // ⚠️ Kiểm tra kỹ candidate hoặc candidateInfo
    const hasCandidate =
      referral.candidate ||
      (referral.candidateInfo &&
        (referral.candidateInfo.fullName || referral.candidateInfo.email || referral.candidateInfo.phone));

    if (!hasCandidate) {
      return respond(res, 400, false, "Referral chưa có thông tin ứng viên (candidate hoặc candidateInfo)");
    }

    // --- Nếu hợp lệ, tiếp tục ---
    referral.steps = [
      { step: "1", name: "Register in Vietnam", status: "pending" },
      { step: "2", name: "Language training", status: "pending" },
      { step: "3", name: "Interview", status: "pending" },
      { step: "4", name: "Complete documentation", status: "pending" },
      { step: "5", name: "Flight", status: "pending" },
      { step: "6", name: "Study and work abroad", status: "pending" }
    ]
    

    

    referral.status = "ongoing";
    referral.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await referral.save();

    // tạo Potential
    if (referral.candidate) {
      await Potential.create({
        referral: referral._id,
        recruiter: referral.recruiter,
        candidate: referral.candidate,
        programm: referral.programm,
      });
    } else {
      await Potential.create({
        referral: referral._id,
        recruiter: referral.recruiter,
        candidateInfo: referral.candidateInfo,
        programm: referral.programm,
      });
    }

    // Set cookie
    res.cookie(`referral_${referral._id}`, "active", {
      httpOnly: true,
      maxAge: 10 * 60 * 1000,
    });

    return respond(res, 200, true, "Referral is ongoing, steps initialized", {
      referralId: referral._id,
      candidate: referral.candidate,
      programm: referral.programm,
      steps: referral.steps,
      expiresAt: referral.expiresAt,
    });
  } catch (err) {
    return respond(res, 500, false, "Server error", err.message);
  }
};

const pauseOrunpauseProgrammById = async (req, res) => {
  try {
    const { id, action } = req.body; // "pause" hoặc "unpause"

    if (!id || !action) {
      return respond(res, 400, false, "Missing required fields: id or action");
    }

    const programm = await Programm.findById(id);
    if (!programm) {
      return respond(res, 404, false, "Programm not found");
    }

    // ✅ đảo trạng thái theo action
    programm.is_active = action === "pause" ? false : true;
    await programm.save();

    return respond(res, 200, true, `Programm ${action} successful`, {
      id: programm._id,
      is_active: programm.is_active,
    });
  } catch (err) {
    console.error("Pause/unpause error:", err);
    return respond(res, 500, false, "Server error", err.message);
  }
};


// Post Controllers
const Post = require('../model/Post');

// 📌 Lấy tất cả bài viết
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteAllPosts = async (req, res) => {
  try {
    await Post.deleteMany({});
    return res.json({
      success: true,
      message: "All posts have been deleted",
    });
  } catch (err) {
    console.error("❌ deleteAllPosts error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getPostsByType = async (req, res) => {
  try {
    console.log("getPostsByType called");
    const { type } = req.query;

    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Missing required query parameter: type",
      });
    }

    // Log type query
    console.log("getPostsByType called with type:", type);

    const posts = await Post.find({ type });
    console.log("Queried posts:", posts);

    console.log(`Found ${posts.length} posts for type ${type}`);

    return res.json({
      success: true,
      message: "Posts fetched successfully",
      data: posts,
    });
  } catch (err) {
    console.error("❌ getPostsByType error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// 📌 Lấy bài viết theo slug
const getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Controller function to get a Post by ID
const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;

    // Find the post by ID in the database
    const post = await Post.findById(postId).populate('progId'); // Populate the associated 'programm' if needed

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Return the found post
    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error("❌ Error fetching post:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

/* =========================================================
   🟢 CREATE POST
   ========================================================= */
   const createPost = async (req, res) => {
    try {
      const {
        type,
        title,
        thumbnail_url,
        content,
        location,
        eventDate,  // 👈 nhận object {date, startTime, endTime}
        status,
        progId,
      } = req.body;
  
      // Kiểm tra dữ liệu đầu vào
      if (!type || !title || !thumbnail_url || !progId) {
        return res.status(400).json({
          success: false,
          message: "Thiếu trường bắt buộc: type, title, thumbnail_url hoặc progId.",
        });
      }
  
      // Kiểm tra sự tồn tại của chương trình
      const programm = await Programm.findById(progId);
      if (!programm) {
        return res.status(404).json({
          success: false,
          message: "Chương trình không tồn tại.",
        });
      }
  
      // Tạo mới Post
      const post = new Post({
        type,
        title,
        thumbnail_url,
        content: content || "",
        location: location || "",
        eventDate: type === "upcoming_event" ? eventDate : undefined,
        status: status || "draft",
        publishedAt: status === "published" ? new Date() : null,
        author: req.user?.id || "admin",
        progId,
      });
  
      await post.save();
  
      // Đảm bảo Programm có details.other là mảng
      if (!programm.details) programm.details = {};
      if (!Array.isArray(programm.details.other)) programm.details.other = [];
  
      programm.details.other.push(post._id);
      await programm.save();
  
      return res.status(201).json({
        success: true,
        message: "Tạo bài viết thành công!",
        data: post,
      });
    } catch (error) {
      console.error("❌ Error creating post:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi tạo bài viết. Vui lòng thử lại sau.",
        error: error.message,
      });
    }
  };


const updatePost = async (req, res) => {
  try {
    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    
    res.json({
      success: true,       // ✅ Thêm dòng này
      data: updated,       // ✅ Gửi lại dữ liệu
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


// 📌 Xóa bài viết
const deletePost = async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }
    res.json({ success: true, message: "Post deleted successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};




const resetReferrals = async (req, res) => {
  try {
    await Referrals.deleteMany({});
    return res.status(200).json({
      success: true,
      message: "All Referrals have been reset."
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to reset Referrals",
      error: err.message
    });
  }
};

// Delete referrals that have no candidate (candidate == null) and related potentials
const deleteReferralsWithNullCandidate = async (req, res) => {
  try {
    // Find referrals where candidate is null
    const referrals = await Referrals.find({ candidate: null }).select("_id");
    if (!referrals || referrals.length === 0) {
      return res.status(200).json({ success: true, message: "No referrals with null candidate found", deletedCount: 0 });
    }

    const ids = referrals.map((r) => r._id);

    // Delete related potentials that reference these referrals
    await Potential.deleteMany({ referral: { $in: ids } });

    // Delete the referrals
    const result = await Referrals.deleteMany({ _id: { $in: ids } });

    return res.status(200).json({ success: true, message: "Deleted referrals with null candidate", deletedCount: result.deletedCount });
  } catch (err) {
    console.error("❌ deleteReferralsWithNullCandidate error:", err);
    return res.status(500).json({ success: false, message: "Failed to delete referrals", error: err.message });
  }
};

// ------------------------------ STEP MANAGEMENT ------------------------------
const adminConfirmCompleteStep = async (req, res) => {
  try {
    const { stepNumber } = req.params;
    const referral = await Referrals.findById(req.params.id);
    if (!referral) return respond(res, 404, false, "Referral not found");

    const step = referral.steps.find((s) => s.step == stepNumber);
    if (!step) return respond(res, 400, false, "Invalid step");


    step.status = "completed";
    step.approvedBy = req.user.id;
    step.updatedAt = new Date();

    // Nếu tất cả step completed => referral completed
    if (referral.steps.every((s) => s.status === "completed")) {
      referral.status = "completed";
    }

    await referral.save();

    // 🔥 Lưu transaction
    // await Transaction.create({
    //   referral: referral._id,
    //   recruiter: referral.recruiter,
    //   step: stepNumber,
    //   amount: step.bonus,
    //   action: "approve_step",
    //   status: "approved",
    //   admin: req.user.id
    // });

    return respond(res, 200, true, "Step approved successfully", referral);
  } catch (err) {
    return respond(res, 500, false, "Server error", err.message);
  }
};

const adminRejectStep = async (req, res) => {
  try {
    const { stepNumber } = req.params;
    const referral = await Referrals.findById(req.params.id);
    if (!referral) return respond(res, 404, false, "Referral not found");

    const step = referral.steps.find((s) => s.step == stepNumber);
    if (!step) return respond(res, 400, false, "Invalid step");


    step.status = "rejected";
    step.approvedBy = req.user.id;
    referral.status = "rejected";
    step.updatedAt = new Date();

    await referral.save();

    // await Transaction.create({
    //   referral: referral._id,
    //   recruiter: referral.recruiter,
    //   step: stepNumber,
    //   amount: 0,
    //   action: "reject_step",
    //   status: "rejected",
    //   admin: req.user.id
    // });
    

    return respond(res, 200, true, "Step rejected successfully", referral);
  } catch (err) {
    return respond(res, 500, false, "Server error", err.message);
  }
};
// ======================= PROGRAMM MANAGEMENT =======================

// Add new programm
const addProgramm = async (req, res) => {
  try {
    const programm = new Programm(req.body);
    await programm.save();
    return respond(res, 201, true, "Programm created successfully", programm);
  } catch (err) {
    return respond(res, 400, false, "Failed to create programm", err.message);
  }
};

// Update programm by ID
const updateProgrammById = async (req, res) => {
  try {
    const programm = await Programm.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!programm) return respond(res, 404, false, "Programm not found");

    return respond(res, 200, true, "Programm updated successfully", programm);
  } catch (err) {
    return respond(res, 400, false, "Failed to update programm", err.message);
  }
};



// Thêm review cho 1 chương trình
const updateProgrammReview = async (req, res) => {
  try {
    const { id } = req.params; // ID của chương trình
    const { rate, content, user } = req.body; // user có thể thêm nếu muốn lưu người review

    // Kiểm tra rate hợp lệ
    if (!rate || rate < 1 || rate > 5) {
      return res.status(400).json({ success: false, message: "Rate phải từ 1 đến 5" });
    }

    const programm = await Programm.findById(id);
    if (!programm) {
      return res.status(404).json({ success: false, message: "Không tìm thấy chương trình" });
    }

    // Khởi tạo mảng review nếu chưa có
    if (!programm.reviews) {
      programm.reviews = [];
    }

    // Tạo reviews mới
    const newReview = {
      rate,
      content,
      createdAt: new Date(),
    };

    // Nếu muốn lưu người reviews
    if (user) newReview.user = user;

    // Push vào mảng reviews
    programm.reviews.push(newReview);

    // Cập nhật tổng số reviews (nếu cần)
    // programm.reviewCount = programm.reviews.length;

    await programm.save();

    res.json({ success: true, message: "Đã thêm reviews", data: newReview });
  } catch (err) {
    console.error("❌ Failed to add reviews:", err);
    res.status(500).json({ success: false, message: "Failed to add reviews", data: err.message });
  }
};

module.exports = { updateProgrammReview};

const sendProgrammQA = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, userId, userName } = req.body;
    console.log(req.body);
    if (!question) {
      return res.status(400).json({ success: false, message: "Missing question" });
    }

    const programm = await Programm.findById(id);
    if (!programm) {
      return res.status(404).json({ success: false, message: "Program not found" });
    }

    // Khởi tạo mảng review nếu chưa có
    if (!programm.qa) {
      programm.qa = [];
    }

    const newQA = {
      question: question,
      user: userId || null,
      userName: userName || "Guest",
      createdAt: new Date(),
    };

    programm.qa.push(newQA);
    console.log("🧾 Program ID:", id);
    console.log("🧾 QA type:", typeof programm.qa, "isArray:", Array.isArray(programm.qa));
    console.log("🧾 QA content:", programm.qa);

    console.log("newQA:", newQA);
    console.log("programm.qa:", programm.qa);
    await programm.save();

    return res.json({ success: true, data: newQA });
  } catch (err) {
    console.error("❌ sendProgrammQA error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const answerProgrammQA = async (req, res) => {
  const { id, qaId } = req.params;
  const { answer } = req.body;
  const userId = req.user._id;
  const userName = req.user.name;
  console.log(req.params);
  console.log("programmId",id); console.log("qaId", qaId);


  if (!answer || !answer.trim()) {
    return res.status(400).json({ success: false, message: "Vui lòng nhập câu trả lời!" });
  }

  try {
    const programm = await Programm.findById(id);
    if (!programm) {
      return res.status(404).json({ success: false, message: "Không tìm thấy chương trình" });
    }

    // Tìm câu hỏi trong chương trình
    const qaItem = programm.qa.find(item => item._id.toString() === qaId);
    if (!qaItem) {
      return res.status(404).json({ success: false, message: "Không tìm thấy câu hỏi" });
    }

    // Cập nhật câu trả lời
    qaItem.answer = answer.trim();
    qaItem.answeredAt = new Date();
    qaItem.answeredBy = userId;
    qaItem.answeredByName = userName;

    await programm.save();

    return res.json({ success: true, data: qaItem });
  } catch (err) {
    console.error("❌ answerQA error:", err);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};



const getProgrammQaList = async (req, res) => {
  try {
    const { id } = req.params;
    const programm = await Programm.findById(id).select("qa");
    if (!programm) {
      return res.status(404).json({ success: false, message: "Program not found" });
    }

    return res.json({ success: true, data: programm.qa });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


// Delete programm by ID
const deleteProgrammById = async (req, res) => {
  try {
    const programm = await Programm.findByIdAndDelete(req.params.id);
    if (!programm) return respond(res, 404, false, "Programm not found");

    return respond(res, 200, true, "Programm deleted successfully", programm);
  } catch (err) {
    return respond(res, 500, false, "Failed to delete programm", err.message);
  }
};


// Reset Transactions
const resetTransactions = async (req, res) => {
  try {
    await Transaction.deleteMany({});
    return res.status(200).json({
      success: true,
      message: "All Transactions have been reset."
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to reset Transactions",
      error: err.message
    });
  }
};

// Reset Potentials
const resetPotentials = async (req, res) => {
  try {
    await Potential.deleteMany({});
    return res.status(200).json({
      success: true,
      message: "All Potentials have been reset."
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to reset Potentials",
      error: err.message
    });
  }
};


// ------------------------------- REPORTING -------------------------------
const getAllPotentialsForAdmin = async (req, res) => {
  try {
    const potentials = await Potential.find()
      .populate("recruiter candidate programm")
      .populate({
        path: "referral",
        populate: { path: "admin", model: "AloWorkUser" }
      });

    return respond(res, 200, true, "All potentials fetched successfully", potentials);
  } catch (err) {
    return respond(res, 500, false, "Server error", err.message);
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("referral recruiter candidate admin");

    return respond(res, 200, true, "All transactions fetched successfully", transactions);
  } catch (err) {
    return respond(res, 500, false, "Server error", err.message);
  }
};


// ------------------------------- EXPORTS -------------------------------
module.exports = {
  // USER
  getProfile,
  updateProfile,
  getReferralsList,
  saveProgramm,
  unsaveProgramm,
  getSavedProgramms,
  updateProgrammReview, answerProgrammQA,
  sendProgrammQA, getProgrammQaList,
  // ADMIN
  getAllUsers,
  rejectedReferralsRequestsById,
  adminConfirmCompleteStep,
  adminRejectStep,
  deleteReferralsWithNullCandidate,
  resetPotentials,
  resetTransactions,
  resetReferrals,
  addProgramm,
  updateProgrammById,
  deleteProgrammById,
  pauseOrunpauseProgrammById,
  
  
  getPosts,
  getPostBySlug,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostsByType,
  deleteAllPosts,


  // RECRUITER
  recruiterRequestStepUpdate,
  makeReferralsRequests,

  // CANDIDATE
  onGoingReferralsRequestsById,
  getLinkFromReferralByIdAndStatus,

  // REPORTING
  getAllPotentialsForAdmin,
  getPotentialsForRecruiter,
  getAllTransactions,
};
