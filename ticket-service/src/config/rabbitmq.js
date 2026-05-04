const amqp = require("amqplib");

let channel;

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(
      process.env.RABBITMQ_URL || "amqp://localhost:5672"
    );

    channel = await connection.createChannel();

    await channel.assertQueue("ticket_events", {
      durable: true
    });

    console.log("RabbitMQ Connected");
  } catch (error) {
    console.error("RabbitMQ Error:", error.message);
  }
};

const publishEvent = async (eventData) => {
  try {
    if (!channel) return;

    channel.sendToQueue(
      "ticket_events",
      Buffer.from(JSON.stringify(eventData)),
      { persistent: true }
    );
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = {
  connectRabbitMQ,
  publishEvent
};