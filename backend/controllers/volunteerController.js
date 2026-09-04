const asyncHandler = require("../utils/asyncHandler");
const Volunteer = require("../models/Volunteer");

// GET /api/volunteers?district=&availability=
const getVolunteers = asyncHandler(async (req, res) => {
  const filter = req.user.role === "coordinator" ? {} : { ownerId: req.user.uid };
  if (req.query.district) filter.preferredDistrict = req.query.district;
  if (req.query.availability) filter.availability = req.query.availability;
  const volunteers = await Volunteer.find(filter).sort({ createdAt: -1 });
  res.json(volunteers);
});

// GET /api/volunteers/:id
const getVolunteerById = asyncHandler(async (req, res) => {
  const filter = req.user.role === "coordinator" ? { _id: req.params.id } : { _id: req.params.id, ownerId: req.user.uid };
  const volunteer = await Volunteer.findOne(filter);
  if (!volunteer) return res.status(404).json({ message: "Volunteer not found" });
  res.json(volunteer);
});

// POST /api/volunteers — public sign-up
const createVolunteer = asyncHandler(async (req, res) => {
  const volunteer = await Volunteer.create({ ...req.body, ownerId: req.user.uid });
  res.status(201).json(volunteer);
});

// PUT /api/volunteers/:id — self or coordinator (e.g. availability toggle)
const updateVolunteer = asyncHandler(async (req, res) => {
  if (req.user.role === "coordinator") {
    return res.status(403).json({ message: "Coordinators can delete volunteers but cannot edit them" });
  }
  const filter = req.user.role === "coordinator" ? { _id: req.params.id } : { _id: req.params.id, ownerId: req.user.uid };
  const volunteer = await Volunteer.findOneAndUpdate(filter, req.body, {
    new: true,
    runValidators: true,
  });
  if (!volunteer) return res.status(404).json({ message: "Volunteer not found" });
  res.json(volunteer);
});

// DELETE /api/volunteers/:id
const deleteVolunteer = asyncHandler(async (req, res) => {
  const filter = req.user.role === "coordinator" ? { _id: req.params.id } : { _id: req.params.id, ownerId: req.user.uid };
  const volunteer = await Volunteer.findOneAndDelete(filter);
  if (!volunteer) return res.status(404).json({ message: "Volunteer not found" });
  res.json({ message: "Volunteer deleted" });
});

// GET /api/volunteers/count — feeds the Home.jsx dashboard
const countVolunteers = asyncHandler(async (req, res) => {
  const total = await Volunteer.countDocuments();
  res.json({ total });
});

module.exports = {
  getVolunteers,
  getVolunteerById,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
  countVolunteers,
};
