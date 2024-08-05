const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate.js");
const {
  getAllOrders,
  shipOrder,
  deliverOrder,
  cancelOrder,
  deleteOrder,
} = require("../controller/adminOrder.controller.js");

router.get("/all", authenticate, getAllOrders);
router.patch("/:orderId/ship-order", authenticate, shipOrder);
router.patch("/:orderId/deliver-order", authenticate, deliverOrder);
router.patch("/:orderId/cancel-order", authenticate, cancelOrder);
router.delete("/:orderId/delete-order", authenticate, deleteOrder);

module.exports = router;
