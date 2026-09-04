const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/requireRole");
const { syncUserProfile, setUserRole } = require("../controllers/userController");

router.post("/sync", authMiddleware, syncUserProfile);
router.post("/:uid/role", authMiddleware, requireRole("coordinator"), setUserRole);

module.exports = router;
