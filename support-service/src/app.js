const express = require("express");
const mongoose = require("mongoose");

const supportRoutes = require("./routes/support.routes");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3002;
const MONGO_URI = process.env.MONGODB_URI;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function connectWithRetry(retries = 10, delay = 3000) {
  while (retries > 0) {
    try {
      await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      });

      console.log("✅ Support Service connected to MongoDB");
      return;

    } catch (err) {
      retries--;

      console.error(
        `❌ MongoDB connection failed. Retries left: ${retries}`
      );

      if (retries === 0) {
        console.error("💥 MongoDB unreachable. Exiting...");
        process.exit(1);
      }

      await sleep(delay);
    }
  }
}

async function startServer() {
  await connectWithRetry();

  app.listen(PORT, () => {
    console.log(`🚀 SUPPORT Service running on port: ${PORT}`);
  });
}

startServer();

app.use("/api/support", supportRoutes);

app.get("/test", (req, res) => {
  res.send("hello");
});