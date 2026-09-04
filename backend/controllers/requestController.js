const asyncHandler = require("../utils/asyncHandler");
const Request = require("../models/Request");

// GET /api/requests?district=&status=
const getRequests = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.district) filter.district = req.query.district;
  if (req.query.status) filter.status = req.query.status;
  const requests = await Request.find(filter).sort({ createdAt: -1 });
  res.json(requests);
});

// GET /api/requests/:id
const getRequestById = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  res.json(request);
});

// POST /api/requests — public, victims shouldn't need to log in
const createRequest = asyncHandler(async (req, res) => {
  const request = await Request.create(req.body);
  res.status(201).json(request);
});

// PUT /api/requests/:id — coordinator only (e.g. status -> Fulfilled)
const updateRequest = asyncHandler(async (req, res) => {
  const request = await Request.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!request) return res.status(404).json({ message: "Request not found" });
  res.json(request);
});

// DELETE /api/requests/:id — coordinator only
const deleteRequest = asyncHandler(async (req, res) => {
  const request = await Request.findByIdAndDelete(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  res.json({ message: "Request deleted" });
});

// GET /api/requests/count — feeds the Home.jsx dashboard
const countRequests = asyncHandler(async (req, res) => {
  const pending = await Request.countDocuments({ status: "Pending" });
  res.json({ pending });
});

module.exports = {
  getRequests,
  getRequestById,
  createRequest,
  updateRequest,
  deleteRequest,
  countRequests,
};
