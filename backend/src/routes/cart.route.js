const express = require("express");
const router = express.Router();
const cartController = require("../controller/cart.controller.js");
const authentication = require("../middleware/authenticate.js");

router.get("/find", authentication, cartController.findUserCart);
router.post("/add", authentication, cartController.addCartItem);
router.delete(
  "/delete/:cartItemId",
  authentication,
  cartController.removeCartItem
);
router.patch("/update/:cartItemID", cartController.updateCartItem);
router.patch("/update-cart", authentication, cartController.updateCart);

module.exports = router;
