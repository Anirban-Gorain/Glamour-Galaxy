const cartService = require("../services/cart.service.js");
const Address = require("../models/address.model.js");
const OrderItem = require("../models/orderItems.model.js");
const Order = require("../models/order.model.js");

async function createOrder(user, shippingAddress) {
  let address;
  shippingAddress.user = user._id;

  if (shippingAddress._id) {
    let isExistAddress = await Address.findById(shippingAddress._id);
    address = isExistAddress;
  } else {
    address = new Address(shippingAddress);
    address.user = user;
    await address.save();

    user.address.push(address);
    await user.save();
  }

  const userCart = await cartService.findUserCart(user._id);
  const orderItems = [];
  const cartId = userCart._id;

  for (let item of userCart.cartItems) {
    const orderedItem = new OrderItem({
      product: item.product._id,
      size: item.size,
      quantity: item.quantity,
      userID: user._id,
      price: item.product.price,
      discountedPrice: item.product.discountedPrice,
      color: item.color,
      cartId,
      // deliveryDate
    });

    await orderedItem.save();
    orderItems.push(orderedItem);
  }

  const ordered = new Order({
    user: user._id,
    orderItems: orderItems.map((item) => item._id),
    totalDiscountedPrice: userCart.totalDiscountPrice,
    discount: userCart.discount,
    totalItem: userCart.totalItem,
    shippingAddress: address._id,
    totalPrice: userCart.totalPrice,
    cartId,
  });

  const finalSavedOrder = await ordered.save();

  return finalSavedOrder;
}

async function findOrderById(orderID) {
  const order = await Order.findById(orderID)
    .populate({ path: "user", populate: { path: "address" } })
    .populate("shippingAddress")
    .populate({ path: "orderItems", populate: { path: "product" } });

  return order;
}

async function placeOrder(orderId) {
  const order = await findOrderById(orderId);
  order.orderStatus = "placed";
  order.paymentDetails.paymentStatus = "completed";
  return await order.save();
}

async function conformOrder(orderID) {
  const order = await findOrderById(orderID);

  order.orderStatus = "placed";
  return await order.save();
}

async function shipOrder(orderId) {
  const order = await findOrderById(orderId);
  order.orderStatus = "shipped";
  return await order.save();
}

async function deliverOrder(orderId) {
  const order = await findOrderById(orderId);
  order.orderStatus = "delivered";
  return await order.save();
}

async function cancelOrder(orderId) {
  const order = await findOrderById(orderId);
  order.orderStatus = "cancelled";
  return await order.save();
}

async function userOrderHistory(userId) {
  try {
    const orders = await Order.find({
      user: userId,
      // orderStatus: "placed",
    })
      .populate({ path: "orderItems", populate: { path: "product" } })
      .populate({ path: "user" })
      .lean();
    return orders;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function deleteOrder(orderID) {
  const deletedOrder = await Order.findByIdAndDelete(orderID);
  const cartId = deletedOrder.cartId;

  const deletedOrderItems = await OrderItem.deleteMany({ cartId: cartId });

  return { deletedOrder, deletedOrderItems };
}

async function getAllOrders() {
  return await Order.find();
}

module.exports = {
  createOrder,
  findOrderById,
  placeOrder,
  shipOrder,
  cancelOrder,
  deliverOrder,
  userOrderHistory,
  deleteOrder,
  getAllOrders,
  conformOrder,
};
