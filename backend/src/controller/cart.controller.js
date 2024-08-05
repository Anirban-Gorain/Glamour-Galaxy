const cartItemService = require("../services/cartItem.service");
const cartServices = require("../services/cart.service");

async function createCart(req, res) {
  const user = req.user;
  try {
    const cart = await cartServices.createCart(user);
    res.status(200).send(cart);
  } catch (error) {
    res.status(200).send(error.message);
  }
}

async function findUserCart(req, res) {
  try {
    const userId = req.user._id;

    const cart = await cartServices.findUserCart(userId);

    res.status(200).send({ cart });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function addCartItem(req, res) {
  const userId = req.user._id;
  try {
    const cart = await cartServices.addCartItem(userId, req.body);
    res.status(200).send(cart);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function removeCartItem(req, res) {
  const { cartItemId } = req.params;
  try {
    const deletedCartItem = await cartItemService.removeCartItem(cartItemId);
    res.status(200).send({ content: deletedCartItem, msg: "success" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

async function updateCartItem(req, res) {
  try {
    const { cartItemID } = req.params;
    const dataToBeUpdated = req.body;
    const updatedCartItem = await cartItemService.updateCartItem(
      cartItemID,
      dataToBeUpdated
    );
    res.status(200).send({ content: updatedCartItem, message: "success" });
  } catch (error) {
    res.status(500).send({ content: error.message });
  }
}

async function updateCart(req, res) {
  try {
    const userId = req.user._id;
    const dataToBeUpdated = req.body;
    const updatedCart = await cartServices.updateCart(userId, dataToBeUpdated);

    res.status(200).send({ cart: updatedCart, msg: "success" });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
}

module.exports = {
  findUserCart,
  addCartItem,
  createCart,
  removeCartItem,
  updateCartItem,
  updateCart,
};
