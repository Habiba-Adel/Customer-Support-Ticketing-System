const Ticket = require("../models/ticket.model");

// Create Ticket
exports.createTicket = async (req, res) => {
  const ticket = await Ticket.create(req.body);
  res.status(201).json(ticket);
};

// Get All Tickets
exports.getTickets = async (req, res) => {
  const tickets = await Ticket.find().sort({ createdAt: -1 });
  res.json(tickets);
};

// Get Single Ticket
exports.getTicketById = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).json({ message: "Ticket not found" });

  res.json(ticket);
};

// Update Ticket (status + data)
exports.updateTicket = async (req, res) => {
  const ticket = await Ticket.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!ticket) return res.status(404).json({ message: "Ticket not found" });

  res.json(ticket);
};

// Delete Ticket
exports.deleteTicket = async (req, res) => {
  const ticket = await Ticket.findByIdAndDelete(req.params.id);

  if (!ticket) return res.status(404).json({ message: "Ticket not found" });

  res.json({ message: "Ticket deleted successfully" });
};