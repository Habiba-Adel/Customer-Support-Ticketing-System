const amqp = require("amqplib");

let channel;
const exchange = "ticket_events_exchange";

const connectRabbitMQ = async () => {
  let URL = process.env.RABBITMQ_URL;
  if (!URL) {
    const user = process.env.RABBITMQ_USER;
    const pass = process.env.RABBITMQ_PASS;
    const host = process.env.RABBITMQ_HOST || "rabbitmq";
    URL = `amqp://${user}:${pass}@${host}:5672`;
  }
  const connection = await amqp.connect(URL);
  channel = await connection.createChannel();
  await channel.assertExchange(exchange, "fanout", { durable: true });
  console.log("RabbitMQ Connected (support)");
};

const publishEvent = (event) => {
  if (!channel) return;
  channel.publish(exchange, "", Buffer.from(JSON.stringify(event)), { persistent: true });
};

module.exports = { connectRabbitMQ, publishEvent };