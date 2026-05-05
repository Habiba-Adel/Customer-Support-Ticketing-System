const amqp = require("amqplib");

let channel;
const exchange = "ticket_events_exchange";

const connectRabbitMQ = async () => {
  const URL = `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}:5672`;
  const connection = await amqp.connect(
   URL
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
