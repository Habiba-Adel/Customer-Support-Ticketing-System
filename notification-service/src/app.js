const express = require("express");
const connectDB = require("./config/db");
const { connectRabbitMQ } = require("./config/rabbitmq");
const startConsumer = require("./consumers/notification.consumer");
const notificationRoutes = require("./routes/notification/notification.routes");
const client = require('prom-client');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;


//adding the endpoint code of the monitoring to can be called to get the data
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});




async function start() {
  try {
    await connectDB();
    await connectRabbitMQ();

    // Start the RabbitMQ worker
    await startConsumer();

    // Register API routes for the frontend
    app.use("/api/notifications", notificationRoutes);

    app.listen(PORT, () => {
      console.log(`Notification Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start service:", error);
    process.exit(1);
  }
}

start();
