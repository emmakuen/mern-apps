const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const validation = require("./validation");
const User = require("../models/User");
const errorMessages = require("./errorMessages");

module.exports = async (req, res) => {
  const { name, email, password } = req.body;

  if (await validation.userExists(email)) {
    return res
      .status(400)
      .json({ errors: [{ msg: errorMessages.userExists }] });
  }
  const avatar = fetchUserAvatar(email);
  const encryptedPassword = await encrypt(password);
  await createUser(name, email, avatar, encryptedPassword);
  return res.send("user registered");
};

/**
 * Fetch Avatar.
 * @desc Fetch avatar with s size, r rating and default to d if avatar doesn't exist
 * @param {string} email
 * @returns {string} - link of user avatar
 */

const fetchUserAvatar = (email) => {
  return gravatar.url(email, {
    s: "200",
    r: "g",
    d: "mp",
  });
};

/**
 * Encrypt Password.
 * @desc Asynchronously generate encrypted password salted 10 rounds
 * @param {string} password
 * @returns {Promise<string>} encrypted password
 */
const encrypt = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const encrypted = await bcrypt.hash(password, salt);
  return encrypted;
};

/**
 * Create User.
 * @desc Asynchronously create user
 * @param {string} name
 * @param {string} email
 * @param {string} avatar
 * @param {string} password
 * @returns {Promise<string>} encrypted password
 */

const createUser = async (name, email, avatar, password) => {
  const user = new User({
    name,
    email,
    avatar,
    password,
  });

  await user.save();
};
