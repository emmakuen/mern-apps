const { validationResult } = require("express-validator");

/**
 * Validation Handler.
 * @desc handle validation errors
 * @requires express-validator
 * @param req
 * @param res
 * @returns {object} 200 - user info
 * @returns {object} 400 - bad request error
 */

const validate = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  res.send("user route");
};

module.exports = validate;
