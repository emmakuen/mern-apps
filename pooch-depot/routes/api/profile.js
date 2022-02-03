const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const messages = require("../../utils/messages");
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
    return res.status(500).send(messages[500]);
  }
});

/**
 * Profiles route.
 * @route POST api/profile
 * @desc Create or Update User Profile
 * @access private
 * @returns {object} http response with profile object
 */

router.post(
  "/",
  [auth, [validation.status, validation.skills]],
  async (req, res) => {
    if (!validation.isRequestValid(req, res)) return;
    const profileFields = profileHelper.buildProfileFields(req);
    try {
      const profile = await profileHelper.createOrUpdateProfile(
        profileFields,
        req.user.id
      );
      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send(messages[500]);
    }
  }
);

/**
 * Profile route.
 * @route GET api/profile
 * @desc Get all profiles
 * @access public
 * @returns {object} 200 -
 */

router.get("/", async (req, res) => {
  try {
    const profiles = await profileHelper.fetchProfiles();
    return res.json(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).send(messages[500]);
  }
});

/**
 * User Profile route.
 * @route GET api/profile/user/:userId
 * @desc Get profile by user id
 * @access public
 * @returns {object} 200 -
 */

router.get("/user/:userId", async (req, res) => {
  try {
    const profiles = await profileHelper.fetchProfile(req.params.userId, res);
    return res.json(profiles);
  } catch (err) {
    console.error(err);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: messages.profileNotFound });
    }
    res.status(500).send(messages[500]);
  }
});

/**
 * User Profile route.
 * @route DELETE api/profile
 * @desc delete profile
 * @access private
 * @returns {object} 200 -
 */

router.delete("/", auth, async (req, res) => {
  try {
    // TODO: remove users posts
    await profileHelper.deleteProfile(req.user.id);
    res.json({ msg: messages.profileDeleted });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(messages[500]);
  }
});

/**
 * Owner route.
 * @route PUT api/profile/owner
 * @desc add owners info to profile
 * @access private
 * @returns {object}
 */

router.put(
  "/owner",
  [auth, [validation.name, validation.title, validation.fromDate]],
  async (req, res) => {
    if (!validation.isRequestValid(req, res)) return;
    try {
      const ownerObject = profileHelper.buildOwnerObject(req);
      const updatedProfile = await profileHelper.addOwner(
        ownerObject,
        req.user.id
      );
      return res.json(updatedProfile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send(messages[500]);
    }
  }
);

/**
 * Owner route.
 * @route DELETE api/profile/owner/:id
 * @desc delete owners info from profile
 * @access private
 * @returns {object}
 */

router.delete("/owner/:id", auth, async (req, res) => {
  try {
    const updatedProfile = await profileHelper.removeOwner(
      req.params.id,
      req.user.id
    );
    return res.json(updatedProfile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(messages[500]);
  }
});

module.exports = router;
