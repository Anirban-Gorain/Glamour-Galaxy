const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  size: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discountedPrice: {
    type: Number,
    require: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  deliveryDate: {
    type: Date,
  },
  color: {
    type: String,
  },
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const OrderItem = mongoose.model("orderItems", orderItemSchema);

module.exports = OrderItem;
