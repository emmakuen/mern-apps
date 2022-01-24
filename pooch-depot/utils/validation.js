const { check } = require("express-validator");

module.exports = Object.freeze({
  name: check("name", "Name is required").notEmpty(),
  email: check("email", "Please enter valid email").isEmail(),
  password: check(
    "password",
    "Please enter a password with 6 or more characters"
  ).isLength({
    min: 6,
  }),
});
