const amqp = require("amqplib");

let channel;
const connectRabbitMQ = async () => {
  const URL = process.env.RABBITMQ_URL;
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
