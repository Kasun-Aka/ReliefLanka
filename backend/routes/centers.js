const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { body, param } = require("express-validator");
const DISTRICTS = require("../constants/districts");
const validate = require("../middleware/validate");
const {
  getCenters,
  getCenterById,
  createCenter,
  updateCenter,
  deleteCenter,
  countCenters,
} = require("../controllers/centerController");

const centerFields = [
  body("centerName").trim().notEmpty().withMessage("Center name is required"),
  body("district").isIn(DISTRICTS).withMessage("Select a valid district"),
  body("address").trim().notEmpty().withMessage("Address is required"),
  body("contactPerson").trim().notEmpty().withMessage("Contact person is required"),
  body("contactPhone").trim().matches(/^\d{10}$/).withMessage("Phone number must contain exactly 10 digits"),
  body("capacity").isInt({ min: 1 }).withMessage("Capacity must be at least 1"),
  body("operatingHours").trim().notEmpty().withMessage("Operating hours are required"),
  body("isActive").optional().isBoolean().withMessage("Invalid active status"),
];

router.get("/count", authMiddleware, countCenters);
router.get("/", authMiddleware, getCenters);
router.get("/:id", authMiddleware, getCenterById);
router.post("/", authMiddleware, centerFields, validate, createCenter);
router.put(
  "/:id",
  authMiddleware,
  [
    param("id").isMongoId().withMessage("Invalid center id"),
    body("centerName").optional().trim().notEmpty().withMessage("Center name is required"),
    body("district").optional().isIn(DISTRICTS).withMessage("Select a valid district"),
    body("address").optional().trim().notEmpty().withMessage("Address is required"),
    body("contactPerson").optional().trim().notEmpty().withMessage("Contact person is required"),
    body("contactPhone").optional().trim().matches(/^\d{10}$/).withMessage("Phone number must contain exactly 10 digits"),
    body("capacity").optional().isInt({ min: 1 }).withMessage("Capacity must be at least 1"),
    body("operatingHours").optional().trim().notEmpty().withMessage("Operating hours are required"),
    body("isActive").optional().isBoolean().withMessage("Invalid active status"),
  ],
  validate,
  updateCenter
);
router.delete("/:id", authMiddleware, param("id").isMongoId().withMessage("Invalid center id"), validate, deleteCenter);

module.exports = router;
