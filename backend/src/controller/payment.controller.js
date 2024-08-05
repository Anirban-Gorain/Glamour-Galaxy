const paymentServices = require("../services/payment.service");
const orderServices = require("../services/order.service");
const cartService = require("../services/cart.service");

// This following function will handle payment and will also place the order. First I will place the order if that is a success then then I will process payment. After placing order if the payment fails then I will delete the placed order. If both are success then that is a overall success.

async function payment(req, res) {
  try {
    const { token, deliveryAddress } = req.body;
    const user = req.user;
    const userCart = await cartService.findUserCart(user._id);
    const priceToBePaid = userCart.totalDiscountPrice;

    // This following will create order, remove the cartItems and clear the order

    const orderResponse = await orderServices.createOrder(
      user,
      deliveryAddress
    );

    // If the order is successful then we will proceed for payment

    let paymentResponse;

    if (orderResponse) {
      paymentResponse = await paymentServices.payment(token, priceToBePaid);

      if (!paymentResponse?.error) {
        // The payment is successful

        // Cart and Cart items need to be cleared

        await cartService.clearCart(user._id);

        res.status(200).send({
          error: false,
          order: orderResponse,
          message: "payment is done and order is placed",
        });

        return;
      } else {
        // The payment is unsuccessful

        // For a payment failure order has to be deleted

        orderServices.deleteOrder(orderResponse._id);

        res.status(400).send({
          error: true,
          message: "payment is failed and order is not placed",
        });

        return;
      }
    }

    res.status(400).send({
      error: true,
      message: "order is not placed and payment did not debit",
    });
  } catch (error) {
    throw Error(error.message);
  }
}

module.exports = { payment };
