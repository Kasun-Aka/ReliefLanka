const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/requireRole");
const DISTRICTS = require("../constants/districts");
const {
  getInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory,
  countInventory,
} = require("../controllers/inventoryController");

const inventoryValidationRules = [
  body("itemName").notEmpty().withMessage("Item name is required"),
  body("category")
    .isIn(["Water", "Food", "Medicine", "Clothing", "Other"])
    .withMessage("Invalid category"),
  body("quantity").isNumeric().withMessage("Quantity must be a number"),
  body("reorderLevel").isNumeric().withMessage("Reorder level must be a number"),
  body("unit").notEmpty().withMessage("Unit is required"),
  body("district").isIn(DISTRICTS).withMessage("Invalid district"),
];

router.get("/count", countInventory);
router.get("/", getInventory);
router.get("/:id", getInventoryById);

router.post(
  "/",
  authMiddleware,
  requireRole("coordinator"),
  inventoryValidationRules,
  validate,
  createInventory
);

router.put(
  "/:id",
  authMiddleware,
  requireRole("coordinator"),
  inventoryValidationRules,
  validate,
  updateInventory
);

router.delete("/:id", authMiddleware, requireRole("coordinator"), deleteInventory);

module.exports = router;
