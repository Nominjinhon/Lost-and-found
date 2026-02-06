const Notification = require("../models/Notification");
const Ad = require("../models/Ad");

const createNotification = async (req, res) => {
  try {
    const { adId, message, contactInfo } = req.body;

    const ad = await Ad.findById(adId);
    if (!ad) {
      res.status(404);
      throw new Error("Ad not found");
    }

    if (ad.user.toString() === req.user.id) {
      res.status(400);
      throw new Error("You cannot claim your own ad");
    }

    const notification = await Notification.create({
      recipient: ad.user,
      sender: req.user.id,
      ad: adId,
      type: "claim",
      message: message || "Таны зарыг эзэмшигч нь гэж мэдээллээ.",
      contactInfo,
    });

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .populate("sender", "name email")
      .populate("ad", "title image type status")
      .sort({ createdAt: -1 });

    const validNotifications = notifications.filter((n) => n.ad);

    res.status(200).json(validNotifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      res.status(404);
      throw new Error("Notification not found");
    }

    if (notification.recipient.toString() !== req.user.id) {
      res.status(401);
      throw new Error("Not authorized");
    }

    notification.status = "read";
    await notification.save();

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyClaim = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      res.status(404);
      throw new Error("Notification not found");
    }

    if (notification.recipient.toString() !== req.user.id) {
      res.status(401);
      throw new Error("Not authorized");
    }

    notification.isVerified = true;
    notification.status = "read";
    await notification.save();

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createNotification,
  getMyNotifications,
  markAsRead,
  verifyClaim,
};
