const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  // Reference to the Ticket DB
  ticketId: String,
  // ID of the user who should see this notification
  userId: String,
  message: String,
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notification", notificationSchema);
