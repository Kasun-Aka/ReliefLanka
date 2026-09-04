const express = require("express");
const { signup, adminSignup, login } = require("../controllers/authController");

const router = express.Router();
router.post("/signup", signup);
router.post("/admin/signup", adminSignup);
router.post("/login", login);

module.exports = router;
