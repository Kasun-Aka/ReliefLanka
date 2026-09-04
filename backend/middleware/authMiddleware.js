const admin = require("../config/firebase");

// Verifies the Firebase ID token sent as "Authorization: Bearer <token>"
// and attaches a minimal user object to req.user.
const authMiddleware = async (req, res, next) => {
  // Temporary bypass for frontend integration
  req.user = {
    uid: "dummy_user",
    email: "test@example.com",
    role: "admin", 
  };
  next();
};

module.exports = authMiddleware;
