const express = require("express");
const connectDB = require("./config/db");
const { connectRabbitMQ } = require("./config/rabbitmq");
const startConsumer = require("./consumers/notification.consumer");

const app = express();
const PORT = process.env.PORT || 3000;

async function start() {
  await connectDB();
  await connectRabbitMQ();
  await startConsumer();

  app.listen(PORT, () => {
    console.log("Notification Service running");
  });
}

start();
