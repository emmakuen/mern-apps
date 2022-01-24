const express = require("express");
const router = express.Router();

/**
 * Posts route.
 * @route GET api/posts
 * @desc Test Route
 * @requires express
 * @access public
 * @param
 * @returns {object} 200 -
 * @returns {Error} default - unexpected error.
 */

router.get("/", (req, res) => {
  return res.send("posts route");
});

module.exports = router;
