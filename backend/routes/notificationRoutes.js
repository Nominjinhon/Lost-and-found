const express = require("express");
const router = express.Router();
const {
  createNotification,
  getMyNotifications,
  markAsRead,
  verifyClaim,
} = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createNotification);
router.get("/", protect, getMyNotifications);
router.put("/:id/read", protect, markAsRead);
router.put("/:id/verify", protect, verifyClaim);

module.exports = router;
