const orderServices = require("../services/order.service.js");

async function getAllOrders(req, res) {
  try {
    const orders = await orderServices.getAllOrders();
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function shipOrder(req, res) {
  const orderId = req.params.orderId;
  try {
    const order = await orderServices.shipOrder(orderId);
    res.status(200).send(order);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function conformOrder(req, res) {
  const orderId = req.params.orderId;
  try {
    const order = await orderServices.conformOrder(orderId);
    res.status(200).send(order);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function deliverOrder(req, res) {
  const orderId = req.params.orderId;
  try {
    const order = await orderServices.deliverOrder(orderId);
    res.status(200).send(order);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function cancelOrder(req, res) {
  const orderId = req.params.orderId;

  try {
    const order = await orderServices.cancelOrder(orderId);
    res.status(200).send(order);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function deleteOrder(req, res) {
  const orderId = req.params.orderId;
  try {
    const order = await orderServices.deleteOrder(orderId);
    res.status(200).send(order);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

module.exports = {
  getAllOrders,
  shipOrder,
  deliverOrder,
  cancelOrder,
  deleteOrder,
  conformOrder,
};
