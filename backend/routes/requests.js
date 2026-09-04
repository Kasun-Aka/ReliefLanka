const express = require("express");
const { body, param } = require("express-validator");
const DISTRICTS = require("../constants/districts");
const validate = require("../middleware/validate");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/requireRole");
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
const requestFields = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("district").isIn(DISTRICTS).withMessage("Select a valid district"),
  body("contactPhone").trim().matches(/^\d{10}$/).withMessage("Phone number must contain exactly 10 digits"),
  body("itemsNeeded").isArray({ min: 1 }).withMessage("Add at least one item"),
  body("itemsNeeded.*").trim().notEmpty().withMessage("Items cannot be empty"),
  body("peopleAffected").isInt({ min: 1 }).withMessage("People affected must be at least 1"),
  body("urgency").optional().isIn(["Low", "Medium", "High"]).withMessage("Invalid urgency"),
];

router.post("/", requestFields, validate, createRequest);
router.put("/:id", authMiddleware, requireRole("coordinator"), [param("id").isMongoId().withMessage("Invalid request id"), body("status").optional().isIn(["Pending", "Fulfilled"]).withMessage("Invalid status")], validate, updateRequest);
router.delete("/:id", authMiddleware, requireRole("coordinator"), param("id").isMongoId().withMessage("Invalid request id"), validate, deleteRequest);

module.exports = router;
