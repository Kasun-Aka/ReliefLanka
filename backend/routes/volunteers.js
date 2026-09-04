const express = require("express");
const { body, param } = require("express-validator");
const router = express.Router();
const DISTRICTS = require("../constants/districts");
const validate = require("../middleware/validate");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getVolunteers,
  getVolunteerById,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
  countVolunteers,
} = require("../controllers/volunteerController");

router.get("/count", authMiddleware, countVolunteers);
router.get("/", authMiddleware, getVolunteers);
router.get("/:id", authMiddleware, getVolunteerById);
const volunteerFields = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("phone")
    .trim()
    .matches(/^\d{10}$/)
    .withMessage("Phone number must contain exactly 10 digits"),
  body("preferredDistrict")
    .isIn(DISTRICTS)
    .withMessage("Select a valid district"),
  body("skills")
    .isArray({ min: 1 })
    .withMessage("Select at least one skill"),
  body("skills.*")
    .isIn(["Medical", "Transport", "Logistics", "Cooking", "General"])
    .withMessage("Select valid volunteer skills"),
  body("availability")
    .optional()
    .isIn(["Available", "Deployed"])
    .withMessage("Select a valid availability status"),
];

router.post("/", authMiddleware, volunteerFields, validate, createVolunteer);
router.put(
  "/:id",
  [
    param("id").isMongoId().withMessage("Invalid volunteer id"),
    body("name").optional().trim().notEmpty().withMessage("Name is required"),
    body("phone").optional().trim().matches(/^\d{10}$/).withMessage("Phone number must contain exactly 10 digits"),
    body("preferredDistrict").optional().isIn(DISTRICTS).withMessage("Select a valid district"),
    body("skills").optional().isArray({ min: 1 }).withMessage("Select at least one skill"),
    body("skills.*").optional().isIn(["Medical", "Transport", "Logistics", "Cooking", "General"]).withMessage("Select valid volunteer skills"),
    body("availability").optional().isIn(["Available", "Deployed"]).withMessage("Select a valid availability status"),
  ],
  validate,
  updateVolunteer
);
router.delete("/:id", authMiddleware, param("id").isMongoId().withMessage("Invalid volunteer id"), validate, deleteVolunteer);

module.exports = router;
