const asyncHandler = require("../utils/asyncHandler");
const Center = require("../models/Center");

// GET /api/centers?district=
const getCenters = asyncHandler(async (req, res) => {
  const filter = req.user.role === "coordinator" ? {} : { $or: [{ isActive: true }, { ownerId: req.user.uid }] };
  if (req.query.district) filter.district = req.query.district;
  const centers = await Center.find(filter).sort({ createdAt: -1 });
  res.json(centers);
});

// GET /api/centers/:id
const getCenterById = asyncHandler(async (req, res) => {
  const filter = req.user.role === "coordinator" ? { _id: req.params.id } : { _id: req.params.id, $or: [{ isActive: true }, { ownerId: req.user.uid }] };
  const center = await Center.findOne(filter);
  if (!center) return res.status(404).json({ message: "Center not found" });
  res.json(center);
});

// POST /api/centers — coordinator only
const createCenter = asyncHandler(async (req, res) => {
  const center = await Center.create({ ...req.body, ownerId: req.user.uid });
  res.status(201).json(center);
});

// PUT /api/centers/:id — coordinator only
const updateCenter = asyncHandler(async (req, res) => {
  if (req.user.role === "coordinator") {
    return res.status(403).json({ message: "Coordinators can delete centers but cannot edit them" });
  }
  const center = await Center.findOneAndUpdate({ _id: req.params.id, ownerId: req.user.uid }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!center) return res.status(404).json({ message: "Center not found" });
  res.json(center);
});

// DELETE /api/centers/:id — coordinator only
const deleteCenter = asyncHandler(async (req, res) => {
  const filter = req.user.role === "coordinator" ? { _id: req.params.id } : { _id: req.params.id, ownerId: req.user.uid };
  const center = await Center.findOneAndDelete(filter);
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
