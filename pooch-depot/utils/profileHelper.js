const Profile = require("../models/Profile");
const User = require("../models/User");
const messages = require("./messages");
const constants = require("../config/constants");
const axios = require("axios").default;

/**
 * Fetch Profile.
 * @desc Asynchronously fetch user profile using user id
 * @param {String} userId
 * @param {object} res - http response object
 * @returns {object} profile object; if profile object doesn't exist, sends 400 error
 */
const fetchProfile = async (userId, res) => {
  const profile = await Profile.findOne({ user: userId }).populate("user", [
    "name",
    "avatar",
  ]);

  if (!profile) {
    return res.status(400).json({ msg: messages.profileNotFound });
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
 * @desc Asynchronously create or update profile on db using profile fields object
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

/**
 * Fetch Profiles.
 * @desc Asynchronously fetches all existing profiles
 * @returns {Array} array of profiles
 */
const fetchProfiles = async () => {
  const profiles = await Profile.find().populate("user", ["name", "avatar"]);
  return profiles;
};

/**
 * Delete Profile.
 * @desc Asynchronously delete profile with the given user id
 * @param {String} userId
 */
const deleteProfile = async (userId) => {
  await Profile.findOneAndRemove({ user: userId });
  await User.findOneAndRemove({ _id: userId });
};

/**
 * Build Owner Object.
 * @desc Build owner object using the data provided in the http request
 * @param {object} req - http request object
 * @returns {object} owner object
 */
const buildOwnerObject = (req) => {
  const { name, title, from, to, current, description } = req.body;
  const owner = { name, title, from, to, current, description };
  return owner;
};

/**
 * Add Owner.
 * @desc Asynchronously add owner to profile
 * @param {object} ownerObject
 * @param {String} userId
 * @returns {object} profile object
 */
const addOwner = async (ownerObject, userId) => {
  const profile = await Profile.findOne({ user: userId });
  profile.owners.unshift(ownerObject);
  await profile.save();
  return profile;
};

/**
 * Remove Owner.
 * @desc Asynchronously remove owner with specified id from profile with given user id
 * @param {String} ownerId
 * @param {String} userId
 * @returns {object} updated profile object
 */
const removeOwner = async (ownerId, userId) => {
  await Profile.updateOne(
    { user: userId },
    {
      $pull: {
        owners: { _id: ownerId },
      },
    }
  );
  return await Profile.findOne({ user: userId });
};

/**
 * Build Vet Object.
 * @desc Build vet object using the data provided in the http request
 * @param {object} req - http request object
 * @returns {object} vet object
 */
const buildVetObject = (req) => {
  const { hospital, name, from, to, current, description } = req.body;
  const vet = { hospital, name, from, to, current, description };
  return vet;
};

/**
 * Add Vet.
 * @desc Asynchronously add vet to profile
 * @param {object} vetObject
 * @param {String} userId
 * @returns {object} profile object
 */
const addVet = async (vetObject, userId) => {
  const profile = await Profile.findOne({ user: userId });
  profile.vets.unshift(vetObject);
  await profile.save();
  return profile;
};

/**
 * Remove Vet.
 * @desc Asynchronously remove vet with specified id from profile with given user id
 * @param {String} vetId
 * @param {String} userId
 * @returns {object} updated profile object
 */
const removeVet = async (vetId, userId) => {
  await Profile.updateOne(
    { user: userId },
    {
      $pull: {
        vets: { _id: vetId },
      },
    }
  );
  return await Profile.findOne({ user: userId });
};

/**
 * Fetch Instagram Feed.
 * @desc Asynchronously fetch instagram feed for username
 * @param {String} username
 * @param {object} res http response object
 * @returns {Array} array of instagram feed objects
 */
const fetchInstagramFeed = async (username, res) => {
  const options = {
    method: "GET",
    url: constants.apiURI,
    params: { username },
    headers: {
      "x-rapidapi-host": constants.apiHost,
      "x-rapidapi-key": constants.apiKey,
    },
  };

  const response = await axios.request(options);
  if (response.status !== 200) {
    return res.status(404).json({ msg: messages.notFound });
  }
  return response.data;
};

module.exports = Object.freeze({
  fetchProfile,
  fetchProfiles,
  buildProfileFields,
  buildOwnerObject,
  buildVetObject,
  addOwner,
  addVet,
  removeOwner,
  removeVet,
  createOrUpdateProfile,
  deleteProfile,
  fetchInstagramFeed,
});
