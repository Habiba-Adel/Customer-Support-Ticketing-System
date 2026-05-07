const amqp = require("amqplib");
const Ticket = require("./models/Ticket");

async function startConsumer() {
  const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://rabbitmq:5672";
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    const queue = "ticket_events";
    await channel.assertQueue(queue, { durable: true });

    console.log(
      `🚀 Reporting Service is waiting for messages in queue: ${queue}`,
    );

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        try {
          // Messages travel through RabbitMQ as "Buffers" (raw binary data/zeros and ones).
          // This converts that binary data back into a readable string.
          const parsedMsg = JSON.parse(msg.content.toString());
          const { event, ticketId, data } = parsedMsg;
          console.log("📊 Reporting Service received a new event:", event);

          switch (event) {
            case "ticket_created":
              await Ticket.create({
                ...data,
                _id: ticketId,
              });
              break;

            case "ticket_status_updated":
              const updatedStatus = { status: data.status };
              if (data.status === "Resolved") {
                updatedStatus.resolvedAt = new Date();
              }
              // await Ticket.findByIdAndUpdate(ticketId, updatedStatus);
              await Ticket.findOneAndUpdate(
                { _id: message.ticketId }, // Use the ticket ID
                {
                  status: message.data.status,
                  resolvedAt: message.data.resolvedAt || new Date(),
                },
              );
              break;

            case "ticket_priority_updated":
              //   await Ticket.findByIdAndUpdate(ticketId, {
              //     priority: data.priority,
              //   });
              await Ticket.findOneAndUpdate(
                { _id: message.ticketId },
                {
                  status: "In Progress",
                  priority: message.data.priority,
                  assignedAgentId: message.data.agentId,
                },
                { new: true, upsert: true },
              );
              break;

            case "ticket_assigned":
              await Ticket.findByIdAndUpdate(ticketId, {
                assignedAgentId: data.assignedAgentId,
              });
              break;

            default:
              console.log(
                "⚠️ Reporting Service received an unknown event type:",
                event,
              );
          }
          channel.ack(msg);
        } catch (err) {
          console.error("❌ Reporting Service failed to process message:", err);
        }
      }
    });
  } catch (err) {
    console.error("❌ RabbitMQ Consumer Error:", err);
  }
}

module.exports = startConsumer;
