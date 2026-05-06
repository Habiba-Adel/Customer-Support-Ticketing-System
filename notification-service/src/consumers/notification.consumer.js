// const { getChannel } = require("../config/rabbitmq");
// const { handleNotification } = require("../services/notification.service");

// async function startConsumer() {
//   const channel = getChannel();
//   const queue = "ticket_events";

//   await channel.assertQueue(queue, { durable: true });

//   // Prefetch(1) ensures this worker only takes one message at a time.
//   // This is vital for load balancing across multiple service instances.
//   // Without this RabbitMQ will push every single message in the queue at once
//   channel.prefetch(1);

//   console.log(`Notification Service listening on: ${queue}`);

//   channel.consume(
//     queue,
//     async (msg) => {
//       if (msg !== null) {
//         try {
//           const content = JSON.parse(msg.content.toString());
//           await handleNotification(content);
//           // Confirms success and deletes from queue
//           channel.ack(msg);
//         } catch (error) {
//           console.error("Error processing message:", error.message);
//           // Requeue the message for another attempt.
//           channel.nack(msg, false, true);
//         }
//       }
//     },
//     { noAck: false },
//   );
// }

// module.exports = startConsumer;


const { getChannel } = require("../config/rabbitmq");
const { handleNotification } = require("../services/notification.service");

async function startConsumer() {
  const channel = getChannel();
  const exchange = "ticket_events_exchange";

  await channel.assertExchange(exchange, "fanout", { durable: true });
  const q = await channel.assertQueue("", { exclusive: true });
  await channel.bindQueue(q.queue, exchange, "");

  console.log(`Notification Service listening on exchange: ${exchange}`);

  channel.consume(q.queue, async (msg) => {
    if (!msg) return;
    try {
      const content = JSON.parse(msg.content.toString());

      // map from what support/ticket service publishes to what handleNotification expects
      const payload = {
        eventType: content.event,
        ticketId: content.ticketId,
        userId: content.data?.customerId || content.data?.userId,
        assignedAgentId: content.data?.agentId,
        ...content.data
      };

      await handleNotification(payload);
      channel.ack(msg);
    } catch (error) {
      console.error("Error processing message:", error.message);
      channel.nack(msg, false, false);
    }
  }, { noAck: false });
}

module.exports = startConsumer;