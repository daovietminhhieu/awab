// middleware/auth.js
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  // Lấy token từ header Authorization: Bearer <token>
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access Denied: No token provided" });
  }

  try {
    // Giải mã token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // chứa id, role hoặc thông tin khác khi bạn ký token
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = auth;
