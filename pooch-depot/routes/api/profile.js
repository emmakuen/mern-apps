const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const errorMessages = require("../../utils/errorMessages");
const validation = require("../../utils/validation");
const profileHelper = require("../../utils/profileHelper");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

/**
 * Profile route.
 * @route GET api/profile/me
 * @desc Get current user profile
 * @access private
 * @returns {object} profile object
 */

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await profileHelper.fetchProfile(req.user.id, res);
    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(errorMessages[500]);
  }
});

/**
 * Profile route.
 * @route POST api/profile
 * @desc Create or Update User Profile
 * @access private
 * @returns {object} 200 -
 */

router.post(
  "/",
  [auth, [validation.status, validation.skills]],
  async (req, res) => {
    if (!validation.isRequestValid(req, res)) return;
    const profileObject = profileHelper.buildProfileFields(req);
    try {
      const profile = await profileHelper.createOrUpdateProfile(
        profileObject,
        req.user.id
      );
      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send(errorMessages[500]);
    }
  }
);

module.exports = router;
