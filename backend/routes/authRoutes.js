const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  toggleSavedAd,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/bookmark/:id", protect, toggleSavedAd);

module.exports = router;
