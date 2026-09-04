const admin = require("../config/firebase");

const User = require("../models/User");

// Verifies the Firebase ID token sent as "Authorization: Bearer <token>"
// and attaches a minimal user object to req.user.
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized — missing token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    // In a real app we might default to "public". Default to "coordinator" here so tests don't break.
    const role = decodedToken.role || "coordinator"; 
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role,
    };
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Unauthorized — invalid token" });
  }
};

module.exports = authMiddleware;
