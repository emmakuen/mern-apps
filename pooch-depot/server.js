const express = require("express");
const connectDB = require("./config/db");
const constants = require("./config/constants");

const app = express();

// Connect Database
connectDB();

app.get("/", (req, res) => res.send("API running..."));

app.listen(constants.PORT, () =>
  console.log(`Server started on port ${constants.PORT}.`)
);
