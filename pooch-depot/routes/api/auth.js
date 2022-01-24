const express = require("express");
const router = express.Router();

/**
 * Auth route.
 * @route GET api/auth
 * @desc Test Route
 * @requires express
 * @access public
 * @param
 * @returns {object} 200 -
 * @returns {Error} default - unexpected error.
 */

router.get("/", (req, res) => {
  return res.send("auth route");
});

module.exports = router;
