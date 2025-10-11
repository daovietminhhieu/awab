// ===================================================== Users parts =====================================================
const AloWorkUser = require("../model/AloWorkUser");

// GET all users
const getAllAloWorkUsers = async (req, res) => {
  try {
    const users = await AloWorkUser.find();
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};

// GET user by ID
const getAloWorkUserById = async (req, res) => {
  try {
    const user = await AloWorkUser.findById(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};

// ADD new user
const addNewAloWorkUser = async (req, res) => {
  try {
    const user = await AloWorkUser.create(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Invalid data", error: err.message });
  }
};

// UPDATE user by ID
const updateAloWorkUserById = async (req, res) => {
  try {
    const user = await AloWorkUser.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Update failed", error: err.message });
  }
};

// DELETE user by ID
const deleteAloWorkUserById = async (req, res) => {
  try {
    const user = await AloWorkUser.findByIdAndDelete(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Delete failed", error: err.message });
  }
};

// DELETE ALL users
const restartUsers = async (req, res) => {
  try {
    await AloWorkUser.deleteMany({});
    res
      .status(200)
      .json({ success: true, message: "Users restarted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Restart failed", error: err.message });
  }
};

// ===================================================== Programm parts =====================================================
const Programm = require("../model/Programm");

// GET all programms
const getAllProgramms = async (req, res) => {
  try {
    const programms = await Programm.find();
    res.status(200).json({
      success: true,
      count: programms.length,
      data: programms,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

// GET programm by ID
const getProgrammById = async (req, res) => {
  try {
    const programm = await Programm.findById(req.params.id);
    if (!programm) {
      return res.status(404).json({
        success: false,
        message: "Programm not found",
      });
    }
    res.status(200).json({
      success: true,
      data: programm,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

// ADD new programm
const addNewProgramm = async (req, res) => {
  try {
    const programm = await Programm.create(req.body);
    res.status(201).json({
      success: true,
      data: programm,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Invalid data",
      error: err.message,
    });
  }
};

// UPDATE programm by ID
const updateProgrammById = async (req, res) => {
  try {
    const programm = await Programm.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!programm) {
      return res.status(404).json({
        success: false,
        message: "Programm not found",
      });
    }
    res.status(200).json({
      success: true,
      data: programm,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Update failed",
      error: err.message,
    });
  }
};

// DELETE programm by ID
const deleteProgrammById = async (req, res) => {
  try {
    const programm = await Programm.findByIdAndDelete(req.params.id);
    if (!programm) {
      return res.status(404).json({
        success: false,
        message: "Programm not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Programm deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Delete failed",
      error: err.message,
    });
  }
};

// Randomize programms type_category
const updateAllProgrammsTypeCategoryRandom = async (req, res) => {
  try {
    const programms = await Programm.find();
    let updatedCount = 0;

    for (const programm of programms) {
      const randomType = Math.random() < 0.5 ? "job" : "studium";
      programm.type_category = randomType;
      await programm.save();
      updatedCount++;
    }

    res.status(200).json({
      success: true,
      message: `Updated ${updatedCount} programms with random type_category.`,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// DELETE ALL programms
const restartProgramms = async (req, res) => {
  try {
    await Programm.deleteMany({});
    res
      .status(200)
      .json({ success: true, message: "Programms restarted successfully" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Restart failed",
      error: err.message,
    });
  }
};

// ----------------------------------------------------- Referral Programm Routes ---------------------------------------------------
const Referrals = require("../model/Referrals");

const getProgrammByReferralId = async (req, res) => {
  try {
    const { id } = req.params; // referralId
    const referral = await Referrals.findById(id)
      .populate("programm")
      .populate("recruiter", "email name");

    if (!referral) {
      return res.status(404).json({ success: false, message: "Referral not found" });
    }

    if (referral.status !== "waiting_candidate") {
      return res.status(400).json({
        success: false,
        message: `Referral is not waiting_candidate (status: ${referral.status})`
      });
    }

    const { programm } = referral;

    return res.json({
      success: true,
      message: "Referral for waiting candidate, programm details loaded.",
      data: { programm },
    });

  } catch(err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ----------------------------------------------------- Candidates Route ------------------------------------------------------------
const fillInformation = async (req, res) => {
  try {
    const { id } = req.params; // referralId
    const referral = await Referrals.findById(id);

    if (!referral) {
      return res.status(404).json({ success: false, message: "Referral not found" });
    }

    if (req.user && req.user.role === "candidate") {
      referral.candidate = req.user.id;
    } else {
      referral.candidateInfo = {
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        resumeFile: req.body.resumeFile,
        coverLetter: req.body.coverLetter,
        otherDocs: Array.isArray(req.body.otherDocs)
          ? req.body.otherDocs.join(",")
          : req.body.otherDocs,
      };
    }

    referral.updatedAt = new Date();
    await referral.save();

    return res.status(200).json({
      success: true,
      message: "Candidate information filled successfully",
      data: referral,
    });
  } catch (err) {
    console.error("❌ fillInformation error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// ----------------------------------------------------- Login && SignUp ------------------------------------------------------------
const jwt = require("jsonwebtoken");

// REGISTER
const doRegister = async (req, res) => {
  try {
    const { name, phone, email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    const existing = await AloWorkUser.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const user = await AloWorkUser.create({
      name,
      phone,
      email,
      password,
      role,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { id: user._id, phone: user.phone, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Register failed", error: err.message });
  }
};

// LOGIN
const doLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    const user = await AloWorkUser.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = password === user.password;
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Login failed", error: err.message });
  }
};

// EXPORT
module.exports = {
  // Users
  getAllAloWorkUsers,
  getAloWorkUserById,
  addNewAloWorkUser,
  updateAloWorkUserById,
  deleteAloWorkUserById,
  restartUsers,

  // Programms
  getAllProgramms,
  getProgrammById,
  addNewProgramm,
  updateProgrammById,
  deleteProgrammById,
  updateAllProgrammsTypeCategoryRandom,
  restartProgramms,

  // Referrals & Candidate
  fillInformation,
  getProgrammByReferralId,

  // Auth
  doRegister,
  doLogin
};
