const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getVolunteers,
  getVolunteerById,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
  countVolunteers,
} = require("../controllers/volunteerController");

router.get("/count", countVolunteers);
router.get("/", getVolunteers);
router.get("/:id", getVolunteerById);
router.post("/", createVolunteer); // public sign-up
router.put("/:id", authMiddleware, updateVolunteer); // self or coordinator
router.delete("/:id", authMiddleware, deleteVolunteer);

module.exports = router;
