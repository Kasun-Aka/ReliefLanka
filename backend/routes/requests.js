const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/requireRole");
const DISTRICTS = require("../constants/districts");
const {
  getRequests,
  getRequestById,
  createRequest,
  updateRequest,
  deleteRequest,
  countRequests,
} = require("../controllers/requestController");

const requestValidationRules = [
  body("name").notEmpty().withMessage("Name is required"),
  body("district").isIn(DISTRICTS).withMessage("Invalid district"),
  body("contactPhone").notEmpty().withMessage("Contact phone is required"),
  body("peopleAffected").isNumeric().withMessage("People affected must be a number").isInt({ min: 1 }),
  body("urgency").optional().isIn(["Low", "Medium", "High"]).withMessage("Invalid urgency"),
  body("status").optional().isIn(["Pending", "Fulfilled"]).withMessage("Invalid status"),
];

router.get("/count", countRequests);
router.get("/", getRequests);
router.get("/:id", getRequestById);
router.post("/", requestValidationRules, validate, createRequest); // public
router.put("/:id", authMiddleware, requireRole("coordinator"), requestValidationRules, validate, updateRequest);
router.delete("/:id", authMiddleware, requireRole("coordinator"), deleteRequest);

module.exports = router;
