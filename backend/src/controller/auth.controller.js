const { getTokenUsingUserID } = require("../config/JWTProvider");
const { comparePassword } = require("../config/bcrypt");
const { createUser, findUserByEmail } = require("../services/user.service");
const { createCart } = require("../services/cart.service");

async function register(req, res) {
  try {
    const { fName, lName, password, email, mobile } = req.body;
    const user = await createUser({ fName, lName, password, email, mobile });
    const token = await getTokenUsingUserID(user._id);

    // Have to create cart

    createCart(user);

    return res
      .status(200)
      .send({ user, token, message: "user register successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      res.status(400).send({ message: "Not found" });
      return;
    }

    // Password checking

    const checkPassMatch = await comparePassword(password, user.password);

    if (!checkPassMatch)
      return res.status(401).send({ message: "login failed" });

    const jwt = await getTokenUsingUserID(user._id);

    return res.status(200).send({ jwt, user, message: "login success" });
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
}

module.exports = { register, login };
