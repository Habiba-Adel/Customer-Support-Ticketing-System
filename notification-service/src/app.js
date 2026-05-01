const express = require("express");
const connectDB = require("./config/db");
const { connectRabbitMQ } = require("./config/rabbitmq");
const startConsumer = require("./consumers/notification.consumer");
const notificationRoutes = require("./routes/notification.routes");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

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
