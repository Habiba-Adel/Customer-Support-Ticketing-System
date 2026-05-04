const amqp = require("amqplib");

let channel;
const exchange = "ticket_events_exchange";

const connectRabbitMQ = async () => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || "amqp://localhost:5672"
  );

  channel = await connection.createChannel();

  await channel.assertExchange(exchange, "fanout", {
    durable: true
  });

  console.log("RabbitMQ Connected");
};

const publishEvent = (event) => {
  if (!channel) return;

  channel.publish(
    exchange,
    "",
    Buffer.from(JSON.stringify(event)),
    { persistent: true }
  );
};

module.exports = { connectRabbitMQ, publishEvent };