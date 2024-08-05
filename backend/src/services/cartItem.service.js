const userService = require("../services/user.service");
const CartItem = require("../models/cartItem.model");

async function findCartItemById(cartItemId) {
  const cartItem = CartItem.find({ _id: cartItemId });

  if (cartItem) {
    return cartItem;
  } else {
    throw new Error("Cart item not found with id " + cartItemId);
  }
}

async function updateCartItem(cartItemId, cartItemData) {
  try {
    const cartItem = await CartItem.findById(cartItemId);

    if (!cartItem) {
      throw new Error("Cart item is not present with id" + cartItemId);
    }

    const newCartItemQuantity = cartItemData.quantity
      ? cartItemData.quantity
      : cartItem.quantity;
    const newCartItemPrice = cartItemData.price
      ? cartItemData.price
      : cartItem.price;
    const newCartItemDiscountedPrice = cartItemData.discountedPrice
      ? cartItemData.discountedPrice
      : cartItem.discountedPrice;

    cartItem.quantity = newCartItemQuantity;
    cartItem.price = newCartItemQuantity * newCartItemPrice;
    cartItem.discountedPrice = newCartItemQuantity * newCartItemDiscountedPrice;

    const updatedCartItem = await cartItem.save();

    return updatedCartItem;
  } catch (error) {
    throw new Error("Cart item can't be updated : " + error.message);
  }
}

async function removeCartItem(cartItemId) {
  try {
    const cartItem = await CartItem.findByIdAndDelete(cartItemId);
    return cartItem;
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = { findCartItemById, updateCartItem, removeCartItem };
