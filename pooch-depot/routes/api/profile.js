const express = require("express");
const router = express.Router();

/**
 * Profile route.
 * @route GET api/profile
 * @desc Test Route
 * @requires express
 * @access public
 * @param
 * @returns {object} 200 -
 * @returns {Error} default - unexpected error.
 */

router.get("/", (req, res) => {
  return res.send("profile route");
});

module.exports = router;
