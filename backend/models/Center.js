const mongoose = require("mongoose");
const DISTRICTS = require("../constants/districts");

const centerSchema = new mongoose.Schema({
  centerName: { type: String, required: true },
  district: { type: String, enum: DISTRICTS, required: true },
  contactPerson: { type: String, required: true },
  contactPhone: { type: String, required: true },
  capacity: { type: Number, default: 0 },
  operatingHours: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Center", centerSchema);
