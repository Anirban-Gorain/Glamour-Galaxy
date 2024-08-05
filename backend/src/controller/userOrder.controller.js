const OrderItem = require("../models/orderItems.model");
const orderServices = require("../services/order.service");

async function createOrder(req, res) {
  const user = req.user;
  const shippingAddress = req.body;
  try {
    const createdOrder = await orderServices.createOrder(user, shippingAddress);
    res.status(200).send(createdOrder);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function deleteOrder(req, res) {
  const orderID = req.params.orderID;
  try {
    const product = await orderServices.findOrderById(orderID);

    if (!product) {
      res.status(404).send({ content: null, msg: "product not fount" });
      return;
    }

    const deletedOrder = await orderServices.deleteOrder(orderID);
    res.status(200).send({ content: deletedOrder, msg: "success" });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function findOrderById(req, res) {
  const orderID = req.params.orderID;
  try {
    const fetchedOrder = await orderServices.findOrderById(orderID);
    res.status(200).send(fetchedOrder);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function orderHistory(req, res) {
  const user = req.user;
  try {
    const orders = await orderServices.userOrderHistory(user._id);
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function conformOrder(req, res) {
  const orderID = req.params.orderID;
  try {
    const changedOrderStatus = await orderServices.conformOrder(orderID);
    res.status(200).send({ content: changedOrderStatus, message: "success" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

module.exports = {
  createOrder,
  deleteOrder,
  findOrderById,
  orderHistory,
  conformOrder,
};
