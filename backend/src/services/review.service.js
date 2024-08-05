const Product = require("../models/product.model");
const Review = require("../models/review.model");

async function createReview(productID, review, userID) {
  const createdReview = new Review({
    user: userID,
    product: productID,
    review: review,
  });

  const specificProduct = await Product.findById(productID);

  // Adding the rating
  specificProduct.reviews.push(createdReview._id);
  await specificProduct.save();

  return await createdReview.save();
}

async function getAllReviews(productId) {
  const reviews = Review.find({ product: productId });

  return reviews;
}

module.exports = { createReview, getAllReviews };
