const { check, validationResult } = require("express-validator");

/**
 * Validation Handler.
 * @desc Handle request validation and send status error
 * @param {object} req - http request object
 * @param {object} res - http response object
 * @returns {Boolean} true/false & sends 400 status if there's error
 */

const isRequestValid = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return false;
  }
  return true;
};

module.exports = Object.freeze({
  name: check("name", "Name is required").notEmpty(),
  title: check("title", "Title is required").notEmpty(),
  email: check("email", "Please enter valid email").isEmail(),
  fromDate: check("from", "From date is required").notEmpty(),
  hospital: check("hospital", "Hospital name is required").notEmpty(),
  password: check(
    "password",
    "Please enter a password with 6 or more characters"
  ).isLength({
    min: 6,
  }),
  passwordExists: check("password", "Password is required").exists(),
  status: check("status", "Status is required").notEmpty(),
  skills: check("skills", "Skills are required").notEmpty(),
  isRequestValid: isRequestValid,
});
