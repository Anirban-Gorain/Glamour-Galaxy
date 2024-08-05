const Cart = require("../models/cart.model");
const CartItem = require("../models/cartItem.model");
const Product = require("../models/product.model");

async function createCart(user) {
  try {
    const cart = new Cart({ user });
    const createdCart = await cart.save();
    return createdCart;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function findUserCart(userId) {
  try {
    let cart = await Cart.findOne({ user: userId })
      .populate({
        path: "cartItems",
        populate: {
          path: "product",
        },
      })
      .lean();

    let totalPrice = 0;
    let totalDiscountedPrice = 0;
    let totalItem = 0;

    for (let cartItem of cart.cartItems) {
      const product = cartItem.product;

      const quantity = cartItem.quantity;
      const price = product.price;
      const discountedPrice = product.discountedPrice;

      totalPrice += quantity * price;
      totalDiscountedPrice += quantity * discountedPrice;
      totalItem += quantity;
    }
    cart.totalPrice = totalPrice;
    cart.totalItem = totalItem;
    cart.totalDiscountPrice = totalDiscountedPrice; // To be paid
    cart.discount = totalPrice - totalDiscountedPrice;

    return cart;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function addCartItem(userID, req) {
  try {
    const cart = await Cart.findOne({ user: userID });
    const product = await Product.findById(req.productID);

    // This following => Whether the product is already present or not

    const isPresent = await CartItem.findOne({
      cart: cart._id,
      product: product._id,
      userID,
    });

    if (!isPresent) {
      const cartItem = new CartItem({
        product: product._id,
        cart: cart._id,
        quantity: req.quantity,
        userID,
        price: product.price,
        size: req.size,
        discountedPrice: product.discountedPrice,
        color: req.color,
      });
      const createdCartItem = await cartItem.save();

      const newTotalPrice = cart.totalPrice + product.price;
      const newTotalItem = cart.totalItem + 1;
      const newDiscountedPrice =
        cart.totalDiscountPrice + product.discountedPrice;
      const newDiscount = newTotalPrice - newDiscountedPrice;

      cart.cartItems.push(createdCartItem);
      cart.totalPrice = newTotalPrice;
      cart.totalItem = newTotalItem;
      cart.discountedPrice = newDiscountedPrice;
      cart.discount = newDiscount;

      const savedCartItem = await cart.save();

      return savedCartItem;
    }
    return "This items is already added";
  } catch (error) {
    throw new Error(error.message);
  }
}

async function updateCart(userId, cartUpdatedData) {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      cartUpdatedData,
      { new: true }
    );
    if (!cart) {
      throw new Error("Cart not found");
    }

    const updatedCart = await cart.save();

    return updatedCart;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function clearCart(userID) {
  try {
    await Cart.findOneAndUpdate({ user: userID }, { cartItems: [] });
    await CartItem.deleteMany({ userID: userID });
  } catch (error) {}
}

module.exports = {
  createCart,
  findUserCart,
  addCartItem,
  updateCart,
  clearCart,
};
