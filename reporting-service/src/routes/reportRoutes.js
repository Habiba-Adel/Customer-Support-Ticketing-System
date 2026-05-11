const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');

// 1st report: Count All tickets
router.get('/total-tickets', async (req, res) => {
    try {
        const count = await Ticket.countDocuments({});
        res.json({ totalTickets: count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2nd report: Count tickets by Status
router.get('/status-counts', async (req, res) => {
    try {
        const stats = await Ticket.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                    // its format
                    // [
                    //     { "_id": "Open", "count": 10 },
                    //     { "_id": "Resolved", "count": 5 },
                    //     { "_id": "In Progress", "count": 3 }
                    // ]
                }
            }
        ]);
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3rd report: Count tickets by Priority
router.get('/priority-counts', async (req, res) => {
    try {
        const stats = await Ticket.aggregate([
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 }
                }
            }
        ]);
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4th report: Average resolution time
router.get('/average-resolution', async (req, res) => {
    try {
        const stats = await Ticket.aggregate([
            {
                $match: { status: "Resolved", resolvedAt: { $exists: true } }
            },
            {
                $project: {
                    resolutionTimeMs: { $subtract: ["$resolvedAt", "$createdAt"] }
                }
            },
            {
                $group: {
                    _id: null,
                    averageTimeHours: {
                        $avg: { $max: [0, { $divide: ["$resolutionTimeMs", 3600000] }] } // Convert milliseconds to hours
                    }
                }
            }
        ])
        res.json(stats[0] || { averageTimeHours: 0 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;