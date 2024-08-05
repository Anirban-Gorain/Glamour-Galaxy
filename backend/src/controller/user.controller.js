const {
  findUserUsingToken,
  getAllUsers,
} = require("../services/user.service.js");

async function getUserProfile(req, res) {
  try {
    const jwt = req.headers.authorization.split(" ")[1];

    const user = await findUserUsingToken(jwt);

    if (!user) res.status(404).send({ message: "Token not found" });

    res.status(200).send({ message: "success", user });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

async function getAllUser(req, res) {
  try {
    const allUsers = await getAllUsers();

    res.status(200).send({ allUsers });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

module.exports = { getUserProfile, getAllUser };
