const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
    ticketId: {
        type: String,
        required: true,
        unique: true // A ticket can only have one assignment record
    },
    agentId: {
        type: String,
        required: true
    },
    assignedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved'],
        default: 'Pending'
    } ,
     messages: [
        {
            sender: {
                type: String, // "agent" or "customer"
                required: true
            },
            message: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
});

module.exports = mongoose.model('Support', supportSchema);