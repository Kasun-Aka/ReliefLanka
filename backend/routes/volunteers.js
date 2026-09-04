const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const authMiddleware = require("../middleware/authMiddleware");
const DISTRICTS = require("../constants/districts");
const {
  getVolunteers,
  getVolunteerById,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
  countVolunteers,
} = require("../controllers/volunteerController");

const volunteerValidationRules = [
  body("name").notEmpty().withMessage("Name is required"),
  body("phone").notEmpty().withMessage("Phone is required"),
  body("preferredDistrict").isIn(DISTRICTS).withMessage("Invalid district"),
  body("skills").optional().isArray(),
  body("skills.*").optional().isIn(["Medical", "Transport", "Logistics", "Cooking", "General"]),
  body("availability").optional().isIn(["Available", "Deployed"]),
];

router.get("/count", countVolunteers);
router.get("/", getVolunteers);
router.get("/:id", getVolunteerById);
router.post("/", volunteerValidationRules, validate, createVolunteer); // public sign-up
router.put("/:id", authMiddleware, volunteerValidationRules, validate, updateVolunteer); // self or coordinator
router.delete("/:id", authMiddleware, deleteVolunteer);

module.exports = router;
