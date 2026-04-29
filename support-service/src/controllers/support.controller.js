const Support = require('../models/support.model'); 

exports.assignAgent = async (req, res) => {
    try {
        const { ticketId, agentId } = req.body;

        let support = await Support.findOne({ ticketId });

        if (support) {
            support.agentId = agentId;
            support.status="In Progress";
        } else {
            support = new Support({
                ticketId,
                agentId,
                status: "In Progress"
            });
        }

        await support.save();

        res.status(200).json({
            message: "Agent assigned successfully",
            data: support
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addResponse = async (req, res) => {
    try {
        const { ticketId, sender, message } = req.body;

        const support = await Support.findOne({ ticketId });

        if (!support) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        support.messages.push({
            sender,
            message
        });

        await support.save();

        res.status(200).json({
            message: "Response added successfully",
            data: support
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.resolveTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;

        const support = await Support.findOne({ ticketId });

        if (!support) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        support.status = "Resolved";

        await support.save();

        res.status(200).json({
            message: "Ticket resolved successfully",
            data: support
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;

        const support = await Support.findOne({ ticketId });

        if (!support) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        res.status(200).json(support);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};