const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const auth = require("../../middleware/auth");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route   GET api/profile/me
// @desc    Get Current User Profile
// @access  Private

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );

    if (!profile)
      return res.status(400).json({ msg: "There is no profile for this user" });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/profile
// @desc    Create or Update User Profile
// @access  Private

const validators = [
  auth,
  [
    check("status", "Status is required").notEmpty(),
    check("skills", "Skills is required").notEmpty(),
  ],
];

router.post("/", validators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin,
  } = req.body;

  const singleFields = {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
  };
  const socialFields = { youtube, facebook, twitter, instagram, linkedin };

  // Build Profile Object
  const profileFields = {};
  profileFields.user = req.user.id;

  Object.keys(singleFields).map((key) => {
    if (singleFields[key]) profileFields[key] = singleFields[key];
  });

  if (skills) {
    profileFields.skills = skills.split(",").map((skill) => skill.trim());
  }

  // Build Social Object
  profileFields.social = {};

  Object.keys(socialFields).map((key) => {
    if (socialFields[key]) profileFields.social[key] = socialFields[key];
  });

  try {
    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      // Update profile
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );

      return res.json(profile);
    }

    // Create profile if not found
    profile = new Profile(profileFields);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
