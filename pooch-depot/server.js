const express = require("express");
const connectDB = require("./config/db");
const constants = require("./config/constants");

const app = express();

// Connect Database
connectDB();

// Initialize Middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API running..."));

// Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

app.listen(constants.PORT, () =>
  console.log(`Server started on port ${constants.PORT}.`)
);
