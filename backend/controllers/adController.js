const Ad = require("../models/Ad");
const Notification = require("../models/Notification");

const getAds = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      res.status(404);
      throw new Error("Ad not found");
    }

    res.status(200).json(ad);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAd = async (req, res) => {
  try {
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
      return res.status(400).json({ message: "Бүх талбарыг бөглөнө үү" });
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getMyAds = async (req, res) => {
  try {
    const ads = await Ad.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(ads);
  } catch (error) {
    console.error("Error fetching my ads:", error);
    res.status(500).json({ message: error.message });
  }
};

const deleteAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      res.status(404);
      throw new Error("Ad not found");
    }

    if (ad.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error("User not authorized");
    }
    await Notification.deleteMany({ ad: req.params.id });

    await ad.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAds,
  getAd,
  createAd,
  getMyAds,
  deleteAd,
};
