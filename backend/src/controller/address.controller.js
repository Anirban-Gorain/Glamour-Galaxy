const addressServices = require("../services/address.service");

async function addAddress(req, res) {
  try {
    const userId = req.user._id;
    const { fName, lName, address, city, state, zipCode, mobile } = req.body;

    const response = await addressServices.addAddress({
      fName,
      lName,
      address,
      city,
      state,
      zipCode,
      mobile,
      user: userId,
    });

    res.status(200).send({ content: response, message: "success" });
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getAllAddresses(req, res) {
  try {
    const userId = req.user._id;
    const allAddress = await addressServices.getAllAddresses(userId);

    res.status(200).send({ content: allAddress, message: "success" });
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = { addAddress, getAllAddresses };
