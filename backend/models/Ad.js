const mongoose = require("mongoose");

const adSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["lost", "found"],
    },
    category: {
      type: String,
      default: "recent",
    },
    location: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    image: {
      type: String,
    },
    contact: {
      type: String,
      required: true,
    },
    features: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

adSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Ad", adSchema);
