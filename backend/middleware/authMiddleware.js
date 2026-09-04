const { verifyToken } = require("../utils/auth");

// Verifies the signed token sent as "Authorization: Bearer <token>"
// and attaches a minimal user object to req.user.
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    req.user = verifyToken(idToken);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
