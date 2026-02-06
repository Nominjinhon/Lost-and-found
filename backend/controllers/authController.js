const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const registerUser = async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ message: "Бүх талбарыг бөглөнө үү" });
    }

    const userExists = await User.findOne({ phone });

    if (userExists) {
      return res
        .status(400)
        .json({ message: "Хэрэглэгч аль хэдийн бүртгэлтэй байна" });
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
      res.status(400).json({ message: "Хэрэглэгчийн мэдээлэл буруу байна" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
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
      res
        .status(401)
        .json({ message: "Утасны дугаар эсвэл нууц үг буруу байна" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("savedAds");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleSavedAd = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const adId = req.params.id;

    if (!user) {
      res.status(404);
      throw new Error("User not found");
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
