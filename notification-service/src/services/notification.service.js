const Notification = require("../models/notification.model");

async function handleNotification(payload) {
  const { eventType, ticketId, userId, assignedAgentId, ...data } = payload;

  console.log(`🔔 Processing ${eventType} for Ticket: ${ticketId}`);

const messages = {
  ticket_created: (d) =>
    `New [${d.priority || "medium"}] ticket: "${d.title}" is now Open.`,
  ticket_status_updated: (d) =>
    `Ticket status changed to: ${d.status}.`,
  ticket_assigned: (d) =>
    `Your ticket has been assigned to an agent.`,
  status_updated: (d) =>
    `Ticket status changed to: ${d.newStatus}.`,
  ticket_resolved: (d) =>
    `Your ticket has been Resolved.`,
};

  const messageGenerator = messages[eventType];
  if (!messageGenerator) {
    console.warn(`⚠️ Unknown event type: ${eventType}`);
    return;
  }

  const messageText = messageGenerator({ ...data, ticketId });

  const recipients = [];

  if (assignedAgentId) recipients.push(assignedAgentId);

  if (userId && !recipients.includes(userId)) {
    recipients.push(userId);
  }

  try {
    const notificationPromises = recipients.map((user) => {
      return Notification.create({
        userId: user,
        ticketId: ticketId,
        type: eventType,
        message: messageText,
        status: data.newStatus || data.status,
        priority: data.priority,
      });
    });

    await Promise.all(notificationPromises);
    console.log(
      `✅ ${recipients.length} notifications saved for ticket ${ticketId}`,
    );
  } catch (error) {
    console.error("❌ Database Error:", error.message);
    throw error;
  }
}

module.exports = { handleNotification };
