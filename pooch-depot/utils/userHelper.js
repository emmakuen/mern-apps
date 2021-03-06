const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const constants = require("../config/constants");
const validation = require("./validation");
const User = require("../models/User");
const messages = require("./messages");

/**
 * Validate and create user.
 * @desc Send error status if user exists, else create user with encrypted password & avatar
 * @param {object} req - http request object
 * @param {object} res - http response object
 * @returns {object} http response with json web token
 */

const validateAndCreateUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (await userExists(email)) {
    return res.status(400).json({ errors: [{ msg: messages.userExists }] });
  }
  const avatar = fetchUserAvatar(email);
  const encryptedPassword = await encrypt(password);
  const userId = await createUser(name, email, avatar, encryptedPassword);
  generateToken(userId, res);
};

/**
 * Existing User Handler.
 * @desc Asynchronously check if user with given email exists
 * @param {string} email
 * @returns {Promise<Boolean>}
 */

const userExists = async (email) => {
  const user = await User.findOne({ email });
  return user ? true : false;
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
 * Validate Credentials.
 * @desc Asynchronously check if inserted credentials are valid
 * @param {string} password
 * @param {string} email
 * @param {object} res - http response object
 * @returns {object} user
 */

const validateCredentials = async (email, password, res) => {
  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(400)
      .json({ errors: [{ msg: messages.invalidCredentials }] });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res
      .status(400)
      .json({ errors: [{ msg: messages.invalidCredentials }] });
  }

  return user;
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
 * @returns {object} http response with json web token
 */

const generateToken = (userId, res) => {
  const payload = {
    user: {
      id: userId,
    },
  };

  // TODO: Change back to 3600 in production
  jwt.sign(
    payload,
    constants.jwtSecret,
    {
      expiresIn: 360000,
    },
    (err, token) => {
      if (err) throw err;
      return res.json({ token });
    }
  );
};

module.exports = Object.freeze({
  generateToken,
  validateAndCreateUser,
  validateCredentials,
});
