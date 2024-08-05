const Address = require("../models/address.model");

async function addAddress(info) {
  try {
    const newUserAddress = new Address(info);
    const response = newUserAddress.save();

    return response;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getAllAddresses(userId) {
  try {
    const allAddresses = await Address.find({ user: userId });
    return allAddresses;
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = { addAddress, getAllAddresses };
