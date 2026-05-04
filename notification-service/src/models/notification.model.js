const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },
    userId: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "ticket_created",
        "status_updated",
        "ticket_resolved",
        "ticket_closed",
      ],
      required: true,
    },
    status: { type: String },
    priority: { type: String },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Notification", notificationSchema);
