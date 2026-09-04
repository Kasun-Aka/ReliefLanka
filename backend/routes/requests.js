const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/requireRole");
const {
  getRequests,
  getRequestById,
  createRequest,
  updateRequest,
  deleteRequest,
  countRequests,
} = require("../controllers/requestController");

router.get("/count", countRequests);
router.get("/", getRequests);
router.get("/:id", getRequestById);
router.post("/", createRequest); // public
router.put("/:id", authMiddleware, requireRole("coordinator"), updateRequest);
router.delete("/:id", authMiddleware, requireRole("coordinator"), deleteRequest);

module.exports = router;
