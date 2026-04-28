const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');

// 1st report: Count tickets by Status
router.get('/status-counts', async (req, res) => {
    try {
        const stats = await Ticket.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2nd report: Average resolution time
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
                        $avg: { $divide: ["$resolutionTimeMs", 3600000] } // Convert milliseconds to hours
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