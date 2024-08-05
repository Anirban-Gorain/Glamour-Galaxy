const crypto = require("crypto");
const { Client, Environment } = require("square");

const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;

const client = new Client({
  accessToken: SQUARE_ACCESS_TOKEN,
  environment: Environment.Sandbox,
});

async function payment(token, amount) {
  try {
    const paymentsApi = client.paymentsApi;
    const requestBody = {
      sourceId: token,
      amountMoney: {
        amount: 1,
        currency: "USD",
      },
      idempotencyKey: crypto.randomUUID(),
    };

    const response = await paymentsApi.createPayment(requestBody);

    return response;
  } catch (e) {
    return { error: true, message: e.message };
  }
}

module.exports = { payment };
