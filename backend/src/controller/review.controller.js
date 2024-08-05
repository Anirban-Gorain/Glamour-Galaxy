const reviewService = require("../services/review.service");

async function createReview(req, res) {
  try {
    const { productID, review } = req.body;
    const userID = req.user._id;

    const createdReview = await reviewService.createReview(
      productID,
      review,
      userID
    );

    res.status(201).send({ content: createdReview, msg: "success" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

async function getAllReviews(req, res) {
  const productID = req.params.productID;
  try {
    const reviews = await reviewService.getAllReviews(productID);
    res.status(200).send({ content: reviews, msg: "success" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

module.exports = { createReview, getAllReviews };
