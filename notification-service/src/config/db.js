const mongoose = require("mongoose");

const connectDB = async () => {
  const dbUrl = process.env.MONGODB_URI;

  try {
    await mongoose.connect(dbUrl);
    console.log("✅ MongoDB connected successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
