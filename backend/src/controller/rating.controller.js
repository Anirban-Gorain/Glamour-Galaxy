const ratingService = require("../services/rating.service");

async function createRating(req, res) {
  const userID = req.user._id;
  const { productID, ratingValue } = req.body;
  try {
    const createdRating = await ratingService.createRating(
      ratingValue,
      userID,
      productID
    );

    res.status(201).send({ content: createdRating, msg: "success" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

async function getAllRatings(req, res) {
  try {
    const { productID } = req.params;
    const ratings = await ratingService.getAllRatings(productID);

    res.status(200).send({ content: ratings, msg: "success" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

module.exports = { createRating, getAllRatings };
