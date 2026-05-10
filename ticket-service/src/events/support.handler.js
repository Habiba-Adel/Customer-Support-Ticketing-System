const Ticket = require("../models/ticket.model");

async function handleSupportEvents(msg) {
  const { event, ticketId, data } = msg;

  switch (event) {
    case "ticket_status_updated":
      await Ticket.findByIdAndUpdate(
        ticketId,
        {
          status: data.status,

          ...(data.status === "Resolved" && {
            resolvedAt: new Date(),
          }),
        },
        {
          new: true,
          runValidators: true,
        },
      );
      break;

    case "ticket_priority_updated":
      await Ticket.findByIdAndUpdate(
        ticketId,
        {
          priority: data.priority,
        },
        {
          new: true,
          runValidators: true,
        },
      );
      break;

    case "ticket_assigned":
      await Ticket.findByIdAndUpdate(
        ticketId,
        {
          assignedAgentId: data.agentId,
          priority: data.priority,
          status: "In Progress",
        },
        {
          new: true,
          runValidators: true,
        },
      );
      break;

    default:
      console.log("Unknown event received in Ticket Service:", event);
  }
}

module.exports = handleSupportEvents;
