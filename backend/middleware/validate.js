const { validationResult } = require("express-validator");

// Drop this in after any express-validator rule chain, e.g.:
// router.post("/", [body("name").notEmpty()], validate, createRequest)
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = validate;
