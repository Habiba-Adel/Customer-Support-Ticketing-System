const Ticket = require("../models/ticket.model");
const { publishEvent } = require("../config/rabbitmq");

// Create Ticket
exports.createTicket = async (req, res) => {
  try {
    const ticket = await Ticket.create({
      ...req.body,
      customerId: req.user.id,
      status: "Open"
    });

    await publishEvent({
      type: "ticket_created",
      data: ticket
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Tickets
exports.getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single Ticket
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found"
      });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Ticket
exports.updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found"
      });
    }

    await publishEvent({
      type: "ticket_updated",
      data: ticket
    });

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Status (called from Support Service)
exports.updateStatus = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (!req.body.status) {
      return res.status(400).json({ message: "status is required" });
    }

    ticket.status = req.body.status;

    if (req.body.assignedAgentId) {
      ticket.assignedAgentId = req.body.assignedAgentId;
    }

    if (req.body.status === "Resolved") {
      ticket.resolvedAt = new Date();
    }

    await ticket.save();

    await publishEvent({
      type: "ticket_status_updated",
      data: ticket
    });

    res.json(ticket);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
// Delete Ticket
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found"
      });
    }

    res.json({
      message: "Ticket deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};