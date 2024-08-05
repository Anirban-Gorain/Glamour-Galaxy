const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  getAllUser,
} = require("../controller/user.controller.js");

router.get("/", getAllUser);
router.get("/profile", getUserProfile);

module.exports = router;
