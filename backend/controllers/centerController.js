const asyncHandler = require("../utils/asyncHandler");
const Center = require("../models/Center");

// GET /api/centers?district=
const getCenters = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.district) filter.district = req.query.district;
  const centers = await Center.find(filter).sort({ createdAt: -1 });
  res.json(centers);
});

// GET /api/centers/:id
const getCenterById = asyncHandler(async (req, res) => {
  const center = await Center.findById(req.params.id);
  if (!center) return res.status(404).json({ message: "Center not found" });
  res.json(center);
});

// POST /api/centers — coordinator only
const createCenter = asyncHandler(async (req, res) => {
  const center = await Center.create(req.body);
  res.status(201).json(center);
});

// PUT /api/centers/:id — coordinator only
const updateCenter = asyncHandler(async (req, res) => {
  const center = await Center.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!center) return res.status(404).json({ message: "Center not found" });
  res.json(center);
});

// DELETE /api/centers/:id — coordinator only
const deleteCenter = asyncHandler(async (req, res) => {
  const center = await Center.findByIdAndDelete(req.params.id);
  if (!center) return res.status(404).json({ message: "Center not found" });
  res.json({ message: "Center deleted" });
});

// GET /api/centers/count — feeds the Home.jsx dashboard
const countCenters = asyncHandler(async (req, res) => {
  const active = await Center.countDocuments({ isActive: true });
  res.json({ active });
});

module.exports = {
  getCenters,
  getCenterById,
  createCenter,
  updateCenter,
  deleteCenter,
  countCenters,
};
