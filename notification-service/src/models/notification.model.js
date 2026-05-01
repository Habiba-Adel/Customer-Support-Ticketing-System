const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  ticketId: String,
  message: String,
  read: {
    type: Boolean,
    default: false,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notification", notificationSchema);
