const amqp = require("amqplib");

let channel;

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(
      process.env.RABBITMQ_URL
    );

    channel = await connection.createChannel();

    await channel.assertQueue("ticket_events");

    console.log("RabbitMQ Connected");
  } catch (error) {
    console.error(error);
  }
};

const publishEvent = async (event) => {
  if (!channel) return;

  channel.sendToQueue(
    "ticket_events",
    Buffer.from(JSON.stringify(event))
  );
};

module.exports = {
  connectRabbitMQ,
  publishEvent
};