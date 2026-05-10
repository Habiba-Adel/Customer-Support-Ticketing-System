const Support = require("../models/support.model");
const { publishEvent } = require("../config/rabbitmq");

exports.assignAgent = async (req, res) => {
  try {
    const { ticketId, agentId, customerId, priority } = req.body;

    let support = await Support.findOne({ ticketId });

    if (support) {
      support.agentId = agentId;
      support.status = "In Progress";
      support.priority = priority;
      if (customerId) support.customerId = customerId;
    } else {
      support = new Support({
        ticketId,
        agentId,
        customerId,
        status: "In Progress",
        priority,
      });
    }

    await support.save();

    // Publish event to ticket-service
    publishEvent({
      event: "ticket_assigned",
      ticketId,
      // data: { agentId }
      data: { agentId, priority: priority || "Medium" },
    });

    res.status(200).json({
      message: "Agent assigned successfully",
      data: support,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addResponse = async (req, res) => {
  try {
    const { ticketId, sender, message } = req.body;

    const support = await Support.findOne({ ticketId });

    if (!support) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    support.messages.push({
      sender,
      message,
    });

    await support.save();

    res.status(200).json({
      message: "Response added successfully",
      data: support,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const support = await Support.findOne({ ticketId });

    if (!support) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json(support);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resolveTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const support = await Support.findOne({ ticketId });
    if (!support) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    support.status = "Resolved";
    await support.save();

    // publish to ticket-service to update ticket_db
    publishEvent({
      event: "ticket_status_updated",
      ticketId,
      data: { status: "Resolved", customerId: support.customerId },
    });

    res
      .status(200)
      .json({ message: "Ticket resolved successfully", data: support });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.closeTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const support = await Support.findOne({ ticketId });
    if (!support) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    support.status = "Closed";
    await support.save();

    // publish to ticket-service to update ticket_db
    publishEvent({
      event: "ticket_status_updated",
      ticketId,
      data: { status: "Closed" },
    });

    res
      .status(200)
      .json({ message: "Ticket closed successfully", data: support });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.reopenTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const support = await Support.findOne({ ticketId });

    if (!support) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // only allow reopen if resolved or closed
    if (!["Resolved", "Closed"].includes(support.status)) {
      return res.status(400).json({
        message: "Only resolved or closed tickets can be reopened",
      });
    }

    support.status = "In Progress";

    await support.save();

    res.status(200).json({
      message: "Ticket reopened successfully",
      data: support,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
