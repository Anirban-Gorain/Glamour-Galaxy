const express = require("express");
const authenticate = require("../middleware/authenticate");
const {
  createRating,
  getAllRatings,
} = require("../controller/rating.controller");
const route = express.Router();

route.post("/create", authenticate, createRating);
route.get("/get/:productID", authenticate, getAllRatings);

module.exports = route;
