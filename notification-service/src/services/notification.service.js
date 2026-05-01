const Notification = require("../models/notification.model");

async function handleNotification(payload) {
  const { eventType, ticketId, metadata } = payload;
  console.log(`Processing ${eventType} for Ticket: ${ticketId}`);

  // Map events to messages (Strategy Pattern)
  const messages = {
    ticket_created: "A new ticket has been created.",
    ticket_updated: "A ticket has been updated.",
    ticket_resolved: "A ticket has been resolved.",
  };

  const messageText = messages[eventType];

  if (!messageText) {
    console.warn(`Unknown event type received: ${eventType}`);
    return;
  }

  try {
    await Notification.create({
      ticketId,
      message: messageText,
    });
  } catch (error) {
    console.error("Failed to save notification:", error);
    throw error;
  }
}

module.exports = {
  handleNotification,
};
