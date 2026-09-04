const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/requireRole");
const {
  getInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory,
  countInventory,
} = require("../controllers/inventoryController");

router.get("/count", countInventory);
router.get("/", getInventory);
router.get("/:id", getInventoryById);
router.post("/", authMiddleware, requireRole("coordinator"), createInventory);
router.put("/:id", authMiddleware, requireRole("coordinator"), updateInventory);
router.delete("/:id", authMiddleware, requireRole("coordinator"), deleteInventory);

module.exports = router;
