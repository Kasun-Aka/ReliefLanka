const express = require("express");
const router = express.Router();
// authMiddleware and requireRole will be re-applied by the auth member in a later phase
// const authMiddleware = require("../middleware/authMiddleware");
// const requireRole = require("../middleware/requireRole");
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
router.post("/", createRequest);
router.put("/:id", updateRequest);
router.delete("/:id", deleteRequest);

module.exports = router;
