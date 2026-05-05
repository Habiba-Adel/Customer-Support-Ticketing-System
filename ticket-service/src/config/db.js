const mongoose = require("mongoose");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const connectDB = async () => {
  const MONGO_URI = process.env.MONGODB_URI;

  let retries = 10;

  while (retries > 0) {
    try {
      await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      });

      console.log("✅ MongoDB Connected");
      return;

    } catch (error) {
      retries--;

      console.error(
        `❌ MongoDB Error: ${error.message} | retries left: ${retries}`
      );

      if (retries === 0) {
        process.exit(1);
      }

      await sleep(3000);
    }
  }
};

module.exports = connectDB;