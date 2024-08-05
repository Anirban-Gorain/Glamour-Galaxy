const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");

const {
  getAllAddresses,
  addAddress,
} = require("../controller/address.controller.js");

router.post("/add", authenticate, addAddress);
router.get("/get", authenticate, getAllAddresses);

module.exports = router;
