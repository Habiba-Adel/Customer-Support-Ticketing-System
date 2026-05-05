// const mongoose = require("mongoose");

// const connectDB = async () => {
//   const dbUrl = process.env.MONGODB_URI;
//   // const dbUrl = "mongodb://mongodb:27017/notifications_db";

//   try {
//     await mongoose.connect(dbUrl);
//     console.log("✅ MongoDB connected successfully!");
//   } catch (error) {
//     console.error("❌ MongoDB connection error:", error.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;




const mongoose = require("mongoose");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//we need to making the connection being retry cause maybe the mongo pod not been up when i try to call it so i will try to call it again later
const connectDB = async () => {
  const dbUrl = process.env.MONGODB_URI;

  let retries = 10;         
  let delay = 3000;       

  while (retries > 0) {
    try {
      await mongoose.connect(dbUrl, {
        serverSelectionTimeoutMS: 5000,
      });

      console.log("✅ MongoDB connected successfully!");
      return; 

    } catch (error) {
      retries--;

      console.error(
        `❌ MongoDB connection failed. Retries left: ${retries}`
      );

      if (retries === 0) {
        console.error("💥 All retries failed. Exiting...");
        process.exit(1);
      }

      await sleep(delay);
    }
  }
};

module.exports = connectDB;