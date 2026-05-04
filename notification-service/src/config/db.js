const mongoose = require("mongoose");

const connectDB = async () => {
  const dbUrl = process.env.MONGODB_URI;
  // const dbUrl = "mongodb://mongodb:27017/notifications_db";

  try {
    await mongoose.connect(dbUrl);
    console.log("✅ MongoDB connected successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
