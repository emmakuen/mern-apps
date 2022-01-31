const jwt = require("jsonwebtoken");
const errorMessages = require("../utils/errorMessages");
const constants = require("../config/constants");

module.exports = (req, res, next) => {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if there's no token
  if (!token) return res.status(401).json({ msg: errorMessages.noToken });

  // Verify token
  try {
    const decoded = jwt.verify(token, constants.jwtSecret);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: errorMessages.invalidToken });
  }
};
