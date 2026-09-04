const asyncHandler = require("../utils/asyncHandler");
const admin = require("../config/firebase");
const User = require("../models/User");

// POST /api/users/sync — called once after Firebase login on the frontend
const syncUserProfile = asyncHandler(async (req, res) => {
  const { uid, email } = req.user;
  let user = await User.findOne({ uid });
  if (!user) {
    user = await User.create({ uid, email, role: "public" });
  }
  res.json(user);
});

// POST /api/users/:uid/role — coordinator only, promotes a user
const setUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const allowed = ["public", "volunteer", "coordinator"];
  if (!allowed.includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  // Sets the claim Firebase embeds in the user's NEXT ID token
  await admin.auth().setCustomUserClaims(req.params.uid, { role });

  const user = await User.findOneAndUpdate(
    { uid: req.params.uid },
    { role },
    { new: true, upsert: true }
  );
  res.json(user);
});

module.exports = { syncUserProfile, setUserRole };
