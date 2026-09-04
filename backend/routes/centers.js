const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/requireRole");
const DISTRICTS = require("../constants/districts");
const {
  getCenters,
  getCenterById,
  createCenter,
  updateCenter,
  deleteCenter,
  countCenters,
} = require("../controllers/centerController");

const centerValidationRules = [
  body("centerName").notEmpty().withMessage("Center name is required"),
  body("district").isIn(DISTRICTS).withMessage("Invalid district"),
  body("contactPerson").notEmpty().withMessage("Contact person is required"),
  body("contactPhone").notEmpty().withMessage("Contact phone is required"),
  body("capacity").optional().isNumeric().withMessage("Capacity must be a number"),
  body("operatingHours").optional().isString(),
  body("isActive").optional().isBoolean(),
];

router.get("/count", countCenters);
router.get("/", getCenters);
router.get("/:id", getCenterById);
router.post("/", authMiddleware, requireRole("coordinator"), centerValidationRules, validate, createCenter);
router.put("/:id", authMiddleware, requireRole("coordinator"), centerValidationRules, validate, updateCenter);
router.delete("/:id", authMiddleware, requireRole("coordinator"), deleteCenter);

module.exports = router;
