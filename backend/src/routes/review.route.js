const express = require("express");
const authenticate = require("../middleware/authenticate");
const {
  createReview,
  getAllReviews,
} = require("../controller/review.controller");
const route = express.Router();

route.post("/create", authenticate, createReview);
route.get("/get/:productID", authenticate, getAllReviews);

module.exports = route;
