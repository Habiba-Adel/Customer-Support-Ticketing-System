
const app = require("./app");
const connectDB = require("./config/db");
const { connectRabbitMQ } = require("./config/rabbitmq");
const startConsumer = require("./consumers/support.consumer");
require("dotenv").config();



const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDB();
    await connectRabbitMQ();
    await startConsumer();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("💥 Startup failed:", err);
    process.exit(1);
  }
}

startServer();