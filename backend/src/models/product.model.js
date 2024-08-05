const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discountedPrice: {
    type: Number,
    set: (data) => {
      return data || 0;
    },
  },
  discountPresent: {
    type: Number,
    set: (data) => {
      return data || 0;
    },
  },
  quantity: {
    type: Number,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  color: [{ type: String }],
  sizes: [
    {
      name: { type: String },
      quantity: { type: Number },
    },
  ],
  imageURL: {
    type: String,
    required: true,
  },
  ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: "ratings" }],
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "reviews",
    },
  ],
  numRatings: {
    type: Number,
    default: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categories",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  topLevelCategory: {
    type: String,
    set: (data) => data.toLowerCase(),
    required: true,
  },
  secondLevelCategory: {
    type: String,
    set: (data) => data.toLowerCase(),
    required: true,
  },
  thirdLevelCategory: {
    type: String,
    set: (data) => data.toLowerCase(),
    required: true,
  },
});

const Product = mongoose.model("products", productSchema);

module.exports = Product;
