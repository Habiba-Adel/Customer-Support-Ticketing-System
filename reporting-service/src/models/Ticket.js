const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        customerId: {
            type: String,
            required: true
        },

        assignedAgentId: {
            type: String,
            default: null
        },

        status: {
            type: String,
            enum: ["Open", "In Progress", "Resolved", "Closed"],
            default: "Open"
        },

        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium"
        },

        resolvedAt: {
            type: Date,
            default: null
        },
        
        createdAt: {
            type: Date,
            default: Date.now
        }
    }

);

module.exports = mongoose.model('Ticket', TicketSchema);