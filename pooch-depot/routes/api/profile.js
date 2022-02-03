const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const messages = require("../../utils/messages");
const validation = require("../../utils/validation");
const profileHelper = require("../../utils/profileHelper");

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
 * @returns {Array} http response with profiles array
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
 * @returns {object} http response with profile object
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
 * @returns {object} http response with status message
 */

router.delete("/", auth, async (req, res) => {
  try {
    // TODO: remove users posts
    await profileHelper.deleteProfile(req.user.id);
    return res.json({ msg: messages.profileDeleted });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(messages[500]);
  }
});

/**
 * Owner route.
 * @route PUT api/profile/owner
 * @desc add owners info to profile
 * @access private
 * @returns {object} http response with updated profile
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
 * @returns {object} http response with updated profile
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
    if (err.kind == "ObjectId") {
      return res.status(400).send({ msg: messages.notFound });
    }
    return res.status(500).send(messages[500]);
  }
});

/**
 * Vet route.
 * @route PUT api/profile/vet
 * @desc add vets info to profile
 * @access private
 * @returns {object} http response with updated profile
 */

router.put(
  "/vet",
  [auth, [validation.hospital, validation.name, validation.fromDate]],
  async (req, res) => {
    if (!validation.isRequestValid(req, res)) return;
    try {
      const vetObject = profileHelper.buildVetObject(req);
      const updatedProfile = await profileHelper.addVet(vetObject, req.user.id);
      return res.json(updatedProfile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send(messages[500]);
    }
  }
);

/**
 * Vet route.
 * @route DELETE api/profile/vet/:id
 * @desc delete vet info from profile
 * @access private
 * @returns {object} response with updated profile
 */

router.delete("/vet/:id", auth, async (req, res) => {
  try {
    const updatedProfile = await profileHelper.removeVet(
      req.params.id,
      req.user.id
    );
    return res.json(updatedProfile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).send({ msg: messages.notFound });
    }
    return res.status(500).send(messages[500]);
  }
});

/**
 * Instagram feed route.
 * @route GET api/profile/github/:username
 * @desc fetch last 12 post from Instagram
 * @access public
 * @returns {Array} response with feed array
 */
router.get("/instagram/:username", async (req, res) => {
  try {
    const instagramData = await profileHelper.fetchInstagramFeed(
      req.params.username,
      res
    );

    return res.json(instagramData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(messages[500]);
  }
});

module.exports = router;
