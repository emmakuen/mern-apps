const express = require("express");
const { check, validationResult } = require("express-validator");
const validation = require("../../utils/validation");
const validate = require("../../utils/validationHandler");

const router = express.Router();

/**
 * Users Route.
 * @route POST api/users
 * @desc Register User
 * @requires express
 * @access public
 * @param validator
 * @returns {object} 200 - object of users info
 * @returns {Error} default - unexpected error.
 */

router.post(
  "/",
  [validation.name, validation.email, validation.password],
  (req, res) => {
    validate(req, res);

    res.send("user route");
  }
);

module.exports = router;
