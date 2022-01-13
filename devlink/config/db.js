const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(db);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.log("Error:", err);

    // Terminate the node process with exit status of failure
    process.exit(1);
  }
};

module.exports = connectDB;
