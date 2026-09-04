const mongoose = require("mongoose");
const DISTRICTS = require("../constants/districts");

const requestSchema = new mongoose.Schema({
  requestId: { type: String, unique: true },           // e.g. REQ-K4F2J9
  name: { type: String, required: true },
  district: { type: String, enum: DISTRICTS, required: true },
  contactPhone: { type: String, required: true },
  itemsNeeded: [{ type: String }],
  peopleAffected: { type: Number, required: true, min: 1 },
  urgency: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  status: { type: String, enum: ["Pending", "Fulfilled"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

// Auto-generate a stylish REQ-XXXXXX identifier before first save
requestSchema.pre("save", function (next) {
  if (!this.requestId) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars
    const suffix = Array.from({ length: 6 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("");
    this.requestId = `REQ-${suffix}`;
  }
  next();
});

module.exports = mongoose.model("Request", requestSchema);
