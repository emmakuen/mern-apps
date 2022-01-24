const express = require("express");
const router = express.Router();

/**
 * Users route.
 * @route GET api/users
 * @desc Test Route
 * @requires express
 * @access public
 * @param
 * @returns {object} 200 - object of users info
 * @returns {Error} default - unexpected error.
 */

router.get("/", (req, res) => {
  return res.send("user route");
});

module.exports = router;
