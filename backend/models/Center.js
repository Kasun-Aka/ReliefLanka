const mongoose = require("mongoose");
const DISTRICTS = require("../constants/districts");

const centerSchema = new mongoose.Schema({
  ownerId: { type: String, required: true, index: true },
  centerName: { type: String, required: true },
  district: { type: String, enum: DISTRICTS, required: true },
  address: { type: String, required: true },
  contactPerson: { type: String, required: true },
  contactPhone: { type: String, required: true },
  capacity: { type: Number, required: true, min: 1 },
  intakeToday: { type: Number, default: 0, min: 0 },
  operatingHours: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Center", centerSchema);
