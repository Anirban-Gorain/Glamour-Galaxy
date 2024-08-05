const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate.js");

const { payment } = require("../controller/payment.controller");

router.post("/process", authenticate, payment);

module.exports = router;
