const config = require("config");

const jwtSecret = config.get("jwtSecret");
const db = config.get("mongoURI");
const apiKey = config.get("apiKey");
const apiHost = config.get("apiHost");
const apiURI = config.get("apiURI");

module.exports = Object.freeze({
  PORT: process.env.PORT || 5000,
  jwtSecret,
  db,
  apiHost,
  apiKey,
  apiURI,
});
