const { getUserIDUsingToken } = require("../config/JWTProvider");
const { hashPassword } = require("../config/bcrypt");
const User = require("../models/user.model");

async function createUser(userCredentials) {
  try {
    const { fName, lName, password, email, mobile } = userCredentials;

    // Is user already exists

    const isUserExists = await User.findOne({ email });

    if (isUserExists) {
      throw new Error("User already exists with email : " + email);
    }

    const encryptedPassword = await hashPassword(password);

    const user = await User.create({
      fName,
      lName,
      email,
      mobile,
      password: encryptedPassword,
    });

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function findUserById(userID) {
  try {
    const user = await User.findById({ _id: userID });
    // .populate("addresses");

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function findUserByEmail(email) {
  try {
    const user = await User.findOne({ email });

    if (!user) throw new Error("Could not found a user with email :" + email);

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function findUserUsingToken(token) {
  try {
    const userID = getUserIDUsingToken(token);
    const user = await findUserById(userID);

    if (!user) throw new Error("Could not found a user with token :" + token);

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getAllUsers() {
  try {
    const allUsers = User.find();

    return allUsers;
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  createUser,
  findUserById,
  findUserByEmail,
  findUserUsingToken,
  getAllUsers,
};
