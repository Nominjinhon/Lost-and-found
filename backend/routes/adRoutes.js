const express = require("express");
const router = express.Router();
const {
  getAds,
  getAd,
  createAd,
  getMyAds,
  deleteAd,
} = require("../controllers/adController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/", getAds);
router.get("/user/me", protect, getMyAds);
router.get("/:id", getAd);
router.post("/", protect, upload.single("image"), createAd);
router.delete("/:id", protect, deleteAd);

module.exports = router;
