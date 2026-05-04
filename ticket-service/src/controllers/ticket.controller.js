const Ticket = require("../models/ticket.model");
const { publishEvent } = require("../config/rabbitmq");

// CREATE
exports.createTicket = async (req, res) => {
  const ticket = await Ticket.create({
    title: req.body.title,
    description: req.body.description,
    customerId: req.user.id,
    status: "Open",
    priority: "Medium"
  });

  publishEvent({
    event: "ticket_created",
    ticketId: ticket._id.toString(),
    data: ticket
  });

  return res.status(201).json(ticket);
};

// GET ALL
exports.getTickets = async (req, res) => {
  const tickets = await Ticket.find().sort({ createdAt: -1 });
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