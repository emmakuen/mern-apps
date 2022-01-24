const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const constants = require("../config/constants");
const validation = require("./validation");
const User = require("../models/User");
const errorMessages = require("./errorMessages");

/**
 * Validate and create user.
 * @desc Send error status if user exists, else create user with encrypted password & avatar
 * @param {object} req - http request object
 * @param {object} res - http response object
 * @returns {object} response with json web token
 */

module.exports = async (req, res) => {
  const { name, email, password } = req.body;

  if (await validation.userExists(email)) {
    return res
      .status(400)
      .json({ errors: [{ msg: errorMessages.userExists }] });
  }
  const avatar = fetchUserAvatar(email);
  const encryptedPassword = await encrypt(password);
  const userId = await createUser(name, email, avatar, encryptedPassword);
  generateToken(userId, res);
};

/**
 * Fetch Avatar.
 * @desc Fetch avatar with s size, r rating and default to d if avatar doesn't exist
 * @param {string} email
 * @returns {string} link of user avatar
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
 * @returns {Promise<string>} user id
 * @param {string} name
 * @param {string} email
 * @param {string} avatar
 * @param {string} password
 */

const createUser = async (name, email, avatar, password) => {
  const user = new User({
    name,
    email,
    avatar,
    password,
  });

  await user.save();
  return user.id;
};

/**
 * Generate Token.
 * @desc Generate json web token
 * @param {string} userId
 * @param {object} res - http response object
 * @returns {object} json web token
 */

const generateToken = (userId, res) => {
  const payload = {
    user: {
      id: userId,
    },
  };
  let token = "";
  // TODO: Change back to 3600 in production
  jwt.sign(
    payload,
    constants.jwtSecret,
    {
      expiresIn: 360000,
    },
    (err, token) => {
      if (err) throw err;
      res.json({ token });
    }
  );
};
