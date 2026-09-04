const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/requireRole");
const {
  getCenters,
  getCenterById,
  createCenter,
  updateCenter,
  deleteCenter,
  countCenters,
} = require("../controllers/centerController");

router.get("/count", countCenters);
router.get("/", getCenters);
router.get("/:id", getCenterById);
router.post("/", authMiddleware, requireRole("coordinator"), createCenter);
router.put("/:id", authMiddleware, requireRole("coordinator"), updateCenter);
router.delete("/:id", authMiddleware, requireRole("coordinator"), deleteCenter);

module.exports = router;
