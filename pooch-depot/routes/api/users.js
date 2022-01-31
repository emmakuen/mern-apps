const express = require("express");
const validation = require("../../utils/validation");
const errorMessages = require("../../utils/errorMessages");
const userHelper = require("../../utils/userHelper");

const router = express.Router();

/**
 * Users Route.
 * @route POST api/users
 * @desc Register User
 * @requires express
 * @access public
 * @param {Array} validation
 * @returns {Object} 200 - object of users info
 * @returns {Error} default - unexpected error.
 */

router.post(
  "/",
  [validation.name, validation.email, validation.password],
  async (req, res) => {
    if (!validation.isRequestValid(req, res)) return;
    try {
      await userHelper.validateAndCreateUser(req, res);
    } catch (err) {
      console.error(err);
      return res.status(500).send(errorMessages[500]);
    }
  }
);

module.exports = router;
