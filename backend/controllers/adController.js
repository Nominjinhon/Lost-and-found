const Ad = require("../models/Ad");
const Notification = require("../models/Notification");
const asyncHandler = require("../utils/asyncHandler");
const {
  sendValidationError,
  sendNotFoundError,
  sendUnauthorizedError,
  sendServerError,
} = require("../utils/errorResponse");

const getAds = asyncHandler(async (req, res) => {
  const { type, location, category, status } = req.query;
  let query = {};

  if (status) query.status = status;
  if (type) query.type = type;
  if (location) {
    query.$or = [
      { district: location },
      { location: { $regex: location, $options: "i" } },
    ];
  }
  if (category) {
    const cats = category.split(",");
    query.type = { $in: cats };
  }

  const ads = await Ad.find(query).sort({ date: -1 });

  res.status(200).json(ads);
});

const getAd = asyncHandler(async (req, res) => {
  const ad = await Ad.findById(req.params.id);

  if (!ad) {
    return sendNotFoundError(res, "Зар олдсонгүй");
  }

  res.status(200).json(ad);
});

const createAd = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    type,
    status,
    category,
    location,
    district,
    date,
    contact,
    features,
  } = req.body;

  if (
    !title ||
    !description ||
    !type ||
    !status ||
    !location ||
    !date ||
    !contact
  ) {
    return sendValidationError(res);
  }

  let imagePath = "";
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = `${url}/uploads/${req.file.filename}`;
  } else if (req.body.imageUrl) {
    imagePath = req.body.imageUrl;
  } else {
    imagePath = "images/backpack.png";
  }

  const ad = await Ad.create({
    user: req.user.id,
    title,
    description,
    type,
    status,
    category: category || "recent",
    location,
    district: district || "Улаанбаатар",
    date,
    image: imagePath,
    contact,
    features,
  });

  res.status(201).json(ad);
});

const getMyAds = asyncHandler(async (req, res) => {
  const ads = await Ad.find({ user: req.user.id }).sort({ date: -1 });
  res.status(200).json(ads);
});

const deleteAd = asyncHandler(async (req, res) => {
  const ad = await Ad.findById(req.params.id);

  if (!ad) {
    return sendNotFoundError(res, "Зар олдсонгүй");
  }

  if (ad.user.toString() !== req.user.id) {
    return sendUnauthorizedError(res, "Та энэ үйлдлийг хийх эрхгүй байна");
  }

  await Notification.deleteMany({ ad: req.params.id });
  await ad.deleteOne();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getAds,
  getAd,
  createAd,
  getMyAds,
  deleteAd,
};
