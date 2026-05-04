require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const { connectRabbitMQ } = require("./config/rabbitmq");
const startConsumer = require("./consumers/support.consumer");

connectDB();
connectRabbitMQ();
startConsumer();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});