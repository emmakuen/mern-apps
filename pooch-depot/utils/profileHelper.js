const Profile = require("../models/Profile");
const errorMessages = require("./errorMessages");

/**
 * Fetch Profile.
 * @desc Fetch user profile using user id
 * @param {String} userId
 * @param {object} res - http response object
 * @returns {object} profile object
 */
const fetchProfile = async (userId, res) => {
  const profile = await Profile.findOne({ user: req.user.id }).populate(
    "user",
    ["name", "avatar"]
  );

  if (!profile) {
    return res.status(400).json({ msg: errorMessages.profileNotFound });
  }

  return profile;
};

/**
 * Build Profile.
 * @desc Build profileFields object using data in the http request
 * @param {object} req - http request object
 * @returns {object} profileFields object
 */
const buildProfileFields = (req) => {
  const {
    breed,
    website,
    status,
    location,
    skills,
    bio,
    instagram,
    youtube,
    twitter,
    facebook,
  } = req.body;

  const singleFields = {
    breed,
    website,
    status,
    location,
    bio,
  };
  const socialFields = { youtube, facebook, twitter, instagram };

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

  return profileFields;
};

/**
 * Create or Update Profile.
 * @desc Create or update profile on db using profile fields object
 * @param {object} profileFields
 * @param {String} userId
 * @returns {object} profile object
 */
const createOrUpdateProfile = async (profileFields, userId) => {
  let profile = await Profile.findOne({ user: userId });

  // Update profile
  if (profile) {
    profile = await Profile.findOneAndUpdate(
      { user: userId },
      { $set: profileFields },
      { new: true }
    );
    return profile;
  }

  //   Create profile if not found
  profile = new Profile(profileFields);
  await profile.save();
  return profile;
};

module.exports = Object.freeze({
  fetchProfile,
  buildProfileFields,
  createOrUpdateProfile,
});
