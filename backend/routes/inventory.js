const express = require("express");
const { body, param } = require("express-validator");
const DISTRICTS = require("../constants/districts");
const validate = require("../middleware/validate");
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
const inventoryFields = [
  body("itemName").trim().notEmpty().withMessage("Item name is required"),
  body("category").isIn(["Water", "Food", "Medicine", "Clothing", "Other"]).withMessage("Invalid category"),
  body("quantity").isFloat({ min: 0 }).withMessage("Quantity cannot be negative"),
  body("reorderLevel").isFloat({ min: 0 }).withMessage("Reorder level cannot be negative"),
  body("unit").trim().notEmpty().withMessage("Unit is required"),
  body("storageLocation").trim().notEmpty().withMessage("Storage location is required"),
  body("district").isIn(DISTRICTS).withMessage("Select a valid district"),
];

router.post("/", authMiddleware, requireRole("coordinator"), inventoryFields, validate, createInventory);
router.put("/:id", authMiddleware, requireRole("coordinator"), [param("id").isMongoId().withMessage("Invalid inventory id"), ...inventoryFields], validate, updateInventory);
router.delete("/:id", authMiddleware, requireRole("coordinator"), param("id").isMongoId().withMessage("Invalid inventory id"), validate, deleteInventory);

module.exports = router;
