const { check, validationResult } = require("express-validator");
const User = require("../models/User");

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

/**
 * Existing User Handler.
 * @desc Asynchronously check if user with given email exists
 * @param {string} email
 * @returns {Promise<Boolean>}
 */

const userExists = async (email) => {
  const user = await User.findOne({ email });
  return user ? true : false;
};

module.exports = Object.freeze({
  name: check("name", "Name is required").notEmpty(),
  email: check("email", "Please enter valid email").isEmail(),
  password: check(
    "password",
    "Please enter a password with 6 or more characters"
  ).isLength({
    min: 6,
  }),
  isRequestValid: isRequestValid,
  userExists,
});
