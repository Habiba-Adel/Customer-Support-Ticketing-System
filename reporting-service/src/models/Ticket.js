const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
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

    createdAt: {
        type: Date,
        default: Date.now
    },

    resolvedAt: {
        type: Date,
        default: null
    }
});

module.exports = mongoose.model("Ticket", ticketSchema);