const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const {
  sendValidationError,
  sendUnauthorizedError,
  sendNotFoundError,
  sendServerError,
} = require("../utils/errorResponse");

const registerUser = asyncHandler(async (req, res) => {
  const { name, phone, password } = req.body;

  if (!name || !phone || !password) {
    return sendValidationError(res);
  }

  const userExists = await User.findOne({ phone });

  if (userExists) {
    return sendValidationError(res, "Хэрэглэгч аль хэдийн бүртгэлтэй байна");
  }

  const user = await User.create({
    name,
    phone,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } else {
    sendValidationError(res, "Хэрэглэгчийн мэдээлэл буруу байна");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;

  const user = await User.findOne({ phone });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user.id,
      name: user.name,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } else {
    sendUnauthorizedError(res, "Утасны дугаар эсвэл нууц үг буруу байна");
  }
});

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .select("-password")
    .populate("savedAds");
  res.status(200).json(user);
});

const toggleSavedAd = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const adId = req.params.id;

  if (!user) {
    return sendNotFoundError(res, "Хэрэглэгч олдсонгүй");
  }

  if (!user.savedAds) user.savedAds = [];

  const adIndex = user.savedAds.findIndex((id) => id.toString() === adId);

  if (adIndex !== -1) {
    user.savedAds.splice(adIndex, 1);
  } else {
    if (!user.savedAds.some((id) => id.toString() === adId)) {
      user.savedAds.push(adId);
    }
  }

  await user.save();

  res.status(200).json(user.savedAds);
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  toggleSavedAd,
};
