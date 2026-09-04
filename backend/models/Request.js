const mongoose = require("mongoose");
const DISTRICTS = require("../constants/districts");

const requestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  district: { type: String, enum: DISTRICTS, required: true },
  contactPhone: { type: String, required: true },
  itemsNeeded: [{ type: String }],
  urgency: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  status: { type: String, enum: ["Pending", "Fulfilled"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Request", requestSchema);
