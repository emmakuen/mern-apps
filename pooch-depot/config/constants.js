const config = require("config");

const db = config.get("mongoURI");
const jwtSecret = config.get("jwtSecret");

module.exports = Object.freeze({
  PORT: process.env.PORT || 5000,
  jwtSecret,
  db,
});
