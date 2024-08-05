const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate.js");
const orderController = require("../controller/userOrder.controller.js");

router.post("/create", authenticate, orderController.createOrder);
router.delete("/delete/:orderID", authenticate, orderController.deleteOrder);
router.get("/all", authenticate, orderController.orderHistory);
router.get("/:orderID", authenticate, orderController.findOrderById);
router.patch(
  "/conform-order/:orderID",
  authenticate,
  orderController.conformOrder
);

module.exports = router;
