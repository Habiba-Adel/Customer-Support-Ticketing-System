const Notification = require("../models/notification.model");

async function handleNotification(payload) {
  const { eventType, ticketId, metadata } = payload;
  console.log(`Processing ${eventType} for Ticket: ${ticketId}`);

  const messages = {
    ticket_created: (data) =>
      `New ticket: "${data.title || "Untitled"}" has been assigned to you.`,
    ticket_updated: (data) => `Ticket #${data.ticketId} has been updated.`,
    ticket_resolved: (data) =>
      `Success! Ticket #${data.ticketId} is now resolved.`,
  };

  // Get the generator function
  const messageGenerator = messages[eventType];

  if (!messageGenerator) {
    console.warn(`Unknown event type received: ${eventType}`);
    return;
  }

  // CALL the function with the metadata/ticketId to get the string
  const messageText = messageGenerator({ ...metadata, ticketId });

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
