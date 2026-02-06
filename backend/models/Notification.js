const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    ad: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Ad",
    },
    type: {
      type: String,
      default: "claim",
    },
    status: {
      type: String,
      default: "unread",
    },
    message: {
      type: String,
    },
    contactInfo: {
      description: String,
      features: String,
      date: Date,
      location: String,
      contact: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Notification", notificationSchema);
