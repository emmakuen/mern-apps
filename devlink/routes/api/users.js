const express = require("express");
const router = express.Router();
const { check, validationResult, body } = require("express-validator");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

const User = require("../../models/User");

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

router.post("/", validation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, email, password } = req.body;

  try {
    // See if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }
    // Send user's gravatar
    const avatar = gravatar.url(email, {
      s: "200",
      r: "g",
      d: "mp",
    });

    user = new User({ name, email, avatar, password });

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Return jsonwebtoken

    res.send("User Registered");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

//// ==== GRAVATAR OPTIONS ==== //
//      s: "200", // size
//      r: "g", // rating - appropriate for all audience
//      d: "mp", // default - user icon (mp: mystery person)
