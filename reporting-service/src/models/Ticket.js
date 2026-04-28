const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
        default: 'Open'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    assignedTo: String, // Agent ID
    // These two fields are vital for our reports!
    createdAt: { type: Date, default: Date.now },
    resolvedAt: { type: Date }
});

module.exports = mongoose.model('Ticket', TicketSchema);