const asyncHandler = require("../utils/asyncHandler");
const Request = require("../models/Request");

// Converts a Mongoose document to the shape the frontend expects.
// Frontend uses `id` as the display identifier (stylish requestId),
// and `_mongoId` as the stable key for PUT/DELETE calls.
const toClient = (doc) => {
  const obj = doc.toObject();
  return {
    id: obj.requestId,       // e.g. "REQ-K4F2J9"
    _mongoId: String(obj._id),
    name: obj.name,
    district: obj.district,
    contactPhone: obj.contactPhone,
    itemsNeeded: obj.itemsNeeded,
    peopleAffected: obj.peopleAffected,
    urgency: obj.urgency,
    status: obj.status,
    createdAt: obj.createdAt,
  };
};

// GET /api/requests?district=&status=&urgency=
const getRequests = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.district) filter.district = req.query.district;
  if (req.query.status)   filter.status   = req.query.status;
  if (req.query.urgency)  filter.urgency  = req.query.urgency;
  const requests = await Request.find(filter).sort({ createdAt: -1 });
  res.json(requests.map(toClient));
});

// GET /api/requests/:id  (accepts mongoId)
const getRequestById = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  res.json(toClient(request));
});

// POST /api/requests — public
const createRequest = asyncHandler(async (req, res) => {
  const request = await Request.create(req.body);
  res.status(201).json(toClient(request));
});

// PUT /api/requests/:id  (accepts mongoId)
const updateRequest = asyncHandler(async (req, res) => {
  const request = await Request.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!request) return res.status(404).json({ message: "Request not found" });
  res.json(toClient(request));
});

// DELETE /api/requests/:id  (accepts mongoId)
const deleteRequest = asyncHandler(async (req, res) => {
  const request = await Request.findByIdAndDelete(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  res.json({ message: "Request deleted" });
});

// GET /api/requests/count — feeds the Home.jsx dashboard
const countRequests = asyncHandler(async (req, res) => {
  const pending = await Request.countDocuments({ status: "Pending" });
  const total   = await Request.countDocuments();
  res.json({ pending, total });
});

module.exports = {
  getRequests,
  getRequestById,
  createRequest,
  updateRequest,
  deleteRequest,
  countRequests,
};
