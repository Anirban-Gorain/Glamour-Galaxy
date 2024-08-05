const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
  cartItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "cartItems",
    },
  ],
  // totalPrice: {
  //   type: Number,
  //   required: true,
  //   default: 0,
  // },
  // totalItem: {
  //   type: Number,
  //   required: true,
  //   default: 0,
  // },
  // totalDiscountPrice: {
  //   type: Number,
  //   default: 0,
  // },
  // discount: {
  //   type: Number,
  //   required: true,
  //   default: 0,
  // },
});

const Cart = mongoose.model("carts", cartSchema);

module.exports = Cart;
