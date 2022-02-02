const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const errorMessages = require("../../utils/errorMessages");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

/**
 * Profile route.
 * @route GET api/profile/me
 * @desc Get current user profile
 * @access private
 * @returns {object} 200 -
 * @returns {Error} default - unexpected error.
 */

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );

    if (!profile) {
      return res.status(400).json({ msg: errorMessages.profileNotFound });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(errorMessages[500]);
  }
});

module.exports = router;
