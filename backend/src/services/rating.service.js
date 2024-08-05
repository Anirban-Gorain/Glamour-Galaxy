const Product = require("../models/product.model");
const Rating = require("../models/rating.model");

async function createRating(ratingValue, userID, productID) {
  const rating = new Rating({
    user: userID,
    product: productID,
    rating: ratingValue,
  });

  const specificProduct = await Product.findById(productID);

  // Adding the rating
  specificProduct.ratings.push(rating._id);
  await specificProduct.save();

  return await rating.save();
}

async function getAllRatings(productId) {
  return await Rating.find({ product: productId });
  // .populate("user")
  // .populate("product");
}

module.exports = {
  createRating,
  getAllRatings,
};
