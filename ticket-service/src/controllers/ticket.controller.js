const Ticket = require("../models/ticket.model");
const { publishEvent } = require("../config/rabbitmq");

// CREATE
exports.createTicket = async (req, res) => {
  const ticket = await Ticket.create({
    title: req.body.title,
    description: req.body.description,
    customerId: req.user.id,
    status: "Open",
    priority: "Medium",
  });

  publishEvent({
    event: "ticket_created",
    ticketId: ticket._id.toString(),
    data: ticket,
  });

  return res.status(201).json(ticket);
};

// GET ALL
exports.getTickets = async (req, res) => {
  let filter = {};

  if (req.user.role === "customer") {
    filter = { customerId: req.user.id };
  } else if (req.user.role === "agent") {
    // Agents see tickets assigned to them
    filter = { assignedAgentId: req.user.id };
  }
  // Admin (if any) sees all

  const tickets = await Ticket.find(filter).sort({ createdAt: -1 });
  return res.json(tickets);
};

// GET unassigned tickets (only for agents)
exports.getUnassignedTickets = async (req, res) => {
  if (req.user.role !== "agent") {
    return res.status(403).json({ message: "Forbidden" });
  }
  const tickets = await Ticket.find({ assignedAgentId: null }).sort({
    createdAt: -1,
  });
  return res.json(tickets);
};

// GET BY ID
exports.getTicketById = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  return res.json(ticket);
};
