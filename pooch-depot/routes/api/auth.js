const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const errorMessages = require("../../utils/errorMessages");
const validation = require("../../utils/validation");
const userHelper = require("../../utils/userHelper");

/**
 * Auth route.
 * @route GET api/auth
 * @desc Test Route
 * @requires express
 * @access public
 * @returns {object} user object
 */

router.get("/", auth, async (req, res) => {
  try {
    // select user but exclude password
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(errorMessages[500]);
  }
});

/**
 * @route POST api/auth
 * @desc Authenticate user & get token
 * @requires express
 * @access public
 * @param
 * @returns {object} 200 -
 * @returns {Error} default - unexpected error.
 */

router.post(
  "/",
  [validation.email, validation.passwordExists],
  async (req, res) => {
    if (!validation.isRequestValid(req, res)) return;

    const { email, password } = req.body;
    try {
      const user = await userHelper.validateCredentials(email, password, res);
      userHelper.generateToken(user.id, res);
    } catch (err) {
      console.error(err);
      return res.status(500).send(errorMessages[500]);
    }
  }
);

module.exports = router;
