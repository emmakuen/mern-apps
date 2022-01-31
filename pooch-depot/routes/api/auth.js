const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const errorMessages = require("../../utils/errorMessages");

/**
 * Auth route.
 * @route GET api/auth
 * @desc Test Route
 * @requires express
 * @access public
 * @param
 * @returns {object} 200 -
 * @returns {Error} default - unexpected error.
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

module.exports = router;
