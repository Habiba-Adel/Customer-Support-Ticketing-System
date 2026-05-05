const amqp = require("amqplib");

let channel;
const connectRabbitMQ = async () => {
  const user = process.env.RABBITMQ_USER;
  const pass = process.env.RABBITMQ_PASS;
  const host = process.env.RABBITMQ_HOST || "rabbitmq";

  const URL = `amqp://${user}:${pass}@${host}:5672`;
  // const URL = process.env.RABBITMQ_URL;
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
