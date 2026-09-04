const mongoose = require("mongoose");
const DISTRICTS = require("../constants/districts");

const volunteerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  preferredDistrict: { type: String, enum: DISTRICTS, required: true },
  skills: [{
    type: String,
    enum: ["Medical", "Transport", "Logistics", "Cooking", "General"],
  }],
  availability: { type: String, enum: ["Available", "Deployed"], default: "Available" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Volunteer", volunteerSchema);
