const express = require('express');
const mongoose = require('mongoose');
//const dotenv = require('dotenv');
const reportRoutes = require('./routes/reportRoutes');
const startConsumer = require('./consumer');
//dotenv.config();
const client = require('prom-client');

const app = express();

const PORT = process.env.PORT || 3005;
const MONGO_URI = process.env.MONGODB_URI;

app.use(express.json());


//adding the monitoring endpoint code to can be called to get the data from it
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});







const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function connectWithRetry(retries = 10, delay = 3000) {
  while (retries > 0) {
    try {
      await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      });

      console.log("✅ Reporting Service connected to MongoDB");
      return true;

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
    console.log(`🚀 Reporting Service running on port ${PORT}`);
    startConsumer();
  });
}

startServer();

app.use("/api/reports", reportRoutes);