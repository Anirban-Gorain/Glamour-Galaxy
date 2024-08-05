const express = require("express");
const router = express.Router();
const categoryController = require("../controller/category.controller.js");

router.get("/get", categoryController.getCategoryTree);

module.exports = router;
