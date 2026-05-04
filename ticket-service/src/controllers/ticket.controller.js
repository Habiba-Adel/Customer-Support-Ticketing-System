const Ticket = require("../models/ticket.model");
const { publishEvent } = require("../config/rabbitmq");


// Create Ticket
exports.createTicket = async (req, res) => {
  try {
    const ticket = await Ticket.create({
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority || "Medium",
      customerId: req.user.id,
      status: "Open"
    });

    await publishEvent({
      event: "ticket_created",
      ticketId: ticket._id.toString(),
      data: ticket
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};


// Get All Tickets
exports.getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({
      createdAt: -1
    });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};


// Get Ticket By ID
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(
      req.params.id
    );

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found"
      });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};


// Update Ticket (customer)
exports.updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found"
      });
    }

    await publishEvent({
      event: "ticket_updated",
      ticketId: ticket._id.toString(),
      data: ticket
    });

    res.json(ticket);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};


// Update Status (agent/support)
exports.updateStatus = async (req, res) => {
  try {
    const updateData = {
      status: req.body.status
    };

    if (req.body.assignedAgentId) {
      updateData.assignedAgentId =
        req.body.assignedAgentId;
    }

    if (req.body.status === "Resolved") {
      updateData.resolvedAt = new Date();
    }

    const ticket =
      await Ticket.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true
        }
      );

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found"
      });
    }

    await publishEvent({
      event: "ticket_status_updated",
      ticketId: ticket._id.toString(),
      data: ticket
    });

    res.json(ticket);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};


// Delete Ticket
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(
      req.params.id
    );

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found"
      });
    }

    await publishEvent({
      event: "ticket_deleted",
      ticketId: ticket._id.toString(),
      data: ticket
    });

    res.json({
      message: "Ticket deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};