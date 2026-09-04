const mongoose = require("mongoose");
const DISTRICTS = require("../constants/districts");

const inventorySchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  category: {
    type: String,
    enum: ["Water", "Food", "Medicine", "Clothing", "Other"],
    required: true,
  },
  quantity: { type: Number, required: true, default: 0 },
  unit: { type: String, required: true },
  storageLocation: String,
  district: { type: String, enum: DISTRICTS, required: true },
  loggedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Inventory", inventorySchema);
