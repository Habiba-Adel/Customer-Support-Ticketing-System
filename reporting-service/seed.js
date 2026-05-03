const mongoose = require('mongoose');
const Ticket = require('./src/models/Ticket');

async function seed() {
    try {
        // Connect to the database
        await mongoose.connect("mongodb://mongo:27017/ticketing_db");

        // 1. Clear existing data so we start fresh
        await Ticket.deleteMany({});
        console.log("Emptying database...");

        const dummyTickets = [
            // Omar Elsherif: 0/2 closed (0%)
            { title: "Login Issue", description: "User can't login", customerId: "C1", assignedAgentId: "Omar Elsherif", status: "Open", priority: "High" },
            { title: "UI Bug", description: "Button is overlapping", customerId: "C2", assignedAgentId: "Omar Elsherif", status: "In Progress", priority: "Low" },

            // Ahmed Mazhar: 0/2 closed (0%)
            { title: "Slow Loading", description: "Dashboard takes 10s", customerId: "C3", assignedAgentId: "Ahmed Mazhar", status: "Open", priority: "Medium" },
            { title: "Export Failed", description: "CSV export error", customerId: "C4", assignedAgentId: "Ahmed Mazhar", status: "In Progress", priority: "High" },

            // Soaad Hosney: 1/2 closed (50%)
            { title: "Forgot Password", description: "Email not sent", customerId: "C5", assignedAgentId: "Soaad Hosney", status: "Resolved", priority: "Low", resolvedAt: new Date() },
            { title: "Wrong Billing", description: "Charged twice", customerId: "C6", assignedAgentId: "Soaad Hosney", status: "Open", priority: "High" },

            // Hend Rostom: 1/2 closed (50%)
            { title: "API Timeout", description: "Internal 500 error", customerId: "C7", assignedAgentId: "Hend Rostom", status: "Closed", priority: "High", resolvedAt: new Date() },
            { title: "CSS Fix", description: "Font size too small", customerId: "C8", assignedAgentId: "Hend Rostom", status: "In Progress", priority: "Low" }
        ];

        await Ticket.insertMany(dummyTickets);
        console.log("✅ Database successfully seeded with 8 tickets matching image_f09605.png!");
        process.exit();
    } catch (err) {
        console.error("❌ Seeding failed:", err);
        process.exit(1);
    }
}

seed();