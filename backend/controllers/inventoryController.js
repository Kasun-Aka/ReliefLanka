const asyncHandler = require("../utils/asyncHandler");
const Inventory = require("../models/Inventory");

// GET /api/inventory?district=&category=
const getInventory = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.district) filter.district = req.query.district;
  if (req.query.category) filter.category = req.query.category;
  const items = await Inventory.find(filter).sort({ loggedAt: -1 });
  res.json(items);
});

// GET /api/inventory/:id
const getInventoryById = asyncHandler(async (req, res) => {
  const item = await Inventory.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Item not found" });
  res.json(item);
});

// POST /api/inventory — coordinator only
const createInventory = asyncHandler(async (req, res) => {
  const item = await Inventory.create(req.body);
  res.status(201).json(item);
});

// PUT /api/inventory/:id — coordinator only
const updateInventory = asyncHandler(async (req, res) => {
  const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) return res.status(404).json({ message: "Item not found" });
  res.json(item);
});

// DELETE /api/inventory/:id — coordinator only
const deleteInventory = asyncHandler(async (req, res) => {
  const item = await Inventory.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: "Item not found" });
  res.json({ message: "Item deleted" });
});

// GET /api/inventory/count — feeds the Home.jsx dashboard
const countInventory = asyncHandler(async (req, res) => {
  const districtsStocked = await Inventory.distinct("district");
  res.json({ districtsStocked: districtsStocked.length });
});

module.exports = {
  getInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory,
  countInventory,
};
