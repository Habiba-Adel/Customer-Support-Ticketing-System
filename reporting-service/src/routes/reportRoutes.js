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
                        // max [0, value] ensures you never see a negative number
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

//5th report: Agent Performance
router.get('/agent-performance', async (req, res) => {
    try {
        const performance = await Ticket.aggregate([
            {
                // ignore tickets that aren't assigned to anyone yet
                $match: { assignedAgentId: { $ne: null } }
            },
            {
                // group tickets by agent
                $group: {
                    _id: "$assignedAgentId",
                    totalAssigned: { $sum: 1 },
                    closedCount: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "Closed"] }, 1, 0]
                        }
                    }
                }
            },
            {
                // calculate percentage
                $project: {
                    agentId: "$_id",
                    totalAssigned: 1,
                    closedCount: 1,
                    closureRate: {
                        $multiply: [
                            { $divide: ["$closedCount", "$totalAssigned"] },
                            100
                        ]
                    }
                }
            }
        ]);
        res.json(performance);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;