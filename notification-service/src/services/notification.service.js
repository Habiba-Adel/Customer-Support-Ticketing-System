const Notification = require("../models/notification.model");

async function handleNotification(payload) {
  // Destructure based on what the Ticket Service actually sends
  const { status, ticketId, ...data } = payload;
  console.log(`Processing ${status} for Ticket: ${ticketId}`);

  const messages = {
    // Triggered when status is "open"
    ticket_created: (data) =>
      `New [${data.priority || "medium"}] ticket: "${data.title || "No Title"}" is now Open.`,
    // Triggered when status moves to "in_progress"
    ticket_updated: (data) => `Ticket #${data.ticketId} is now In Progress.`,
    // Triggered when status is "resolved"
    ticket_resolved: (data) =>
      `Success! Ticket #${data.ticketId} has been Resolved.`,
    // Triggered when status is "closed"
    ticket_closed: (data) => `Ticket #${data.ticketId} is now Closed.`,
  };

  const messageGenerator = messages[status];
  if (!messageGenerator) {
    console.warn(`Unknown status received: ${status}`);
    return;
  }

  // Extract who this notification is for from the metadata
  const targetUser = data.assignedTo || data.userId;
  // CALL the function with the metadata/ticketId to get the string
  const messageText = messageGenerator({ ...data, ticketId });

  // 1. Determine recipients based on the event
  const recipients = [];

  if (data.assignedTo) recipients.push(data.assignedTo);

  // Notify the customer for updates and resolution
  if (data.userId) {
    if (!recipients.includes(data.userId)) {
      recipients.push(data.userId);
    }
  }

  try {
    // Create a notification for every recipient found customer or agent
    console.log("Attempting to save to DB...");
    const notificationPromises = recipients.map((user) => {
      return Notification.create({
        userId: user,
        ticketId,
        status,
        message: messageText,
      });
    });

    await Promise.all(notificationPromises);

    if (recipients.length > 0) {
      console.log(
        `${recipients.length} notifications created for ticket ${ticketId}`,
      );
    }
  } catch (error) {
    console.error("Failed to save notification:", error);
    // This triggers the RabbitMQ 'nack' (retry) logic in the consumer
    throw error;
  }
}

module.exports = { handleNotification };
