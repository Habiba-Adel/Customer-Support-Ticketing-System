const amqp = require("amqplib");
const handleSupportEvents = require("../events/support.handler");

async function startConsumer() {
  const conn = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await conn.createChannel();

  const exchange = "ticket_events_exchange";

  await channel.assertExchange(exchange, "fanout", {
    durable: true
  });

  const q = await channel.assertQueue("", {
    exclusive: true
  });

  await channel.bindQueue(q.queue, exchange, "");

  console.log("Ticket Service listening for Support events...");

  channel.consume(q.queue, async (msg) => {
    if (!msg) return;

    try {
      const data = JSON.parse(msg.content.toString());

      await handleSupportEvents(data);

      channel.ack(msg);

    } catch (err) {
      console.error("Consumer error:", err.message);
      channel.nack(msg, false, false); // avoid infinite loop
    }
  });
}

module.exports = startConsumer;