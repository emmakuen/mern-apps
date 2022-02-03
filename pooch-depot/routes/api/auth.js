const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const messages = require("../../utils/messages");
const validation = require("../../utils/validation");
const userHelper = require("../../utils/userHelper");

/**
 * Auth route.
 * @route GET api/auth
 * @desc Test Route
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
    res.status(500).send(messages[500]);
  }
});

/**
 * @route POST api/auth
 * @desc Authenticate user & get token
 * @access public
 * @param
 * @returns {object} jwt token
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
      return res.status(500).send(messages[500]);
    }
  }
);

module.exports = router;
