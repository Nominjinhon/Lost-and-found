const Notification = require("../models/Notification");
const Ad = require("../models/Ad");
const asyncHandler = require("../utils/asyncHandler");
const {
  sendValidationError,
  sendNotFoundError,
  sendUnauthorizedError,
  sendServerError,
} = require("../utils/errorResponse");

const createNotification = asyncHandler(async (req, res) => {
  const { adId, message, contactInfo } = req.body;

  const ad = await Ad.findById(adId);
  if (!ad) {
    return sendNotFoundError(res, "Зар олдсонгүй");
  }

  if (ad.user.toString() === req.user.id) {
    return sendValidationError(res, "Та өөрийн зарыг эзэмших боломжгүй");
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
});

const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user.id })
    .populate("sender", "name email")
    .populate("ad", "title image type status")
    .sort({ createdAt: -1 });

  const validNotifications = notifications.filter((n) => n.ad);

  res.status(200).json(validNotifications);
});

const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return sendNotFoundError(res, "Мэдэгдэл олдсонгүй");
  }

  if (notification.recipient.toString() !== req.user.id) {
    return sendUnauthorizedError(res, "Та энэ үйлдлийг хийх эрхгүй байна");
  }

  notification.status = "read";
  await notification.save();

  res.status(200).json(notification);
});

const verifyClaim = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id).populate(
    "ad",
    "title",
  );

  if (!notification) {
    return sendNotFoundError(res, "Мэдэгдэл олдсонгүй");
  }

  if (notification.recipient.toString() !== req.user.id) {
    return sendUnauthorizedError(res, "Та энэ үйлдлийг хийх эрхгүй байна");
  }

  notification.isVerified = true;
  notification.status = "read";
  await notification.save();

  await Notification.create({
    recipient: notification.sender,
    sender: req.user.id,
    ad: notification.ad._id,
    type: "claim_verified",
    message: `Таны "${notification.ad.title}" зарт өгсөн мэдээлэл баталгаажлаа!`,
    status: "unread",
  });

  res.status(200).json(notification);
});

const rejectClaim = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id).populate(
    "ad",
    "title",
  );

  if (!notification) {
    return sendNotFoundError(res, "Мэдэгдэл олдсонгүй");
  }

  if (notification.recipient.toString() !== req.user.id) {
    return sendUnauthorizedError(res, "Та энэ үйлдлийг хийх эрхгүй байна");
  }

  notification.isRejected = true;
  notification.status = "read";
  await notification.save();

  await Notification.create({
    recipient: notification.sender,
    sender: req.user.id,
    ad: notification.ad._id,
    type: "claim_rejected",
    message: `Таны "${notification.ad.title}" зарт өгсөн мэдээлэл цуцлагдлаа.`,
    status: "unread",
  });

  res.status(200).json(notification);
});

module.exports = {
  createNotification,
  getMyNotifications,
  markAsRead,
  verifyClaim,
  rejectClaim,
};
