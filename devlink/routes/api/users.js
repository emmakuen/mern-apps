const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

// @route   POST api/users
// @desc    Register User
// @access  Public

const validation = [
  check("name", "Name is required").notEmpty(),
  check("email", "Please include valid email").isEmail(),
  check(
    "password",
    "Please insert password with 6 or more characters."
  ).isLength({ min: 6 }),
];

router.post("/", validation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  res.send("User Route");
});

module.exports = router;
