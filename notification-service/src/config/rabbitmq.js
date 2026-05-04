const amqp = require("amqplib");
const URL = "amqp://rabbitmq";

let channel;
const connectRabbitMQ = async () => {
  const connection = await amqp.connect(URL);
  channel = await connection.createChannel();
  console.log("RabbitMQ connected");
};

const getChannel = () => {
  return channel;
};

module.exports = {
  connectRabbitMQ,
  getChannel,
};
