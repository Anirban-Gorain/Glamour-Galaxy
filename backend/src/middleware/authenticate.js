const JWTProvider = require("../config/JWTProvider");
const userServices = require("../services/user.service");

async function authenticate(req, res, next) {
  try {
    // How the authenticate token looks like => Bearer Token...... (So we need to extract the Token......)

    const JWTToken = req.headers.authorization?.split(" ")[1];

    if (!JWTToken) {
      res.status(400).send({ message: "JWT token is not provided" });
      return;
    }

    const userId = await JWTProvider.getUserIDUsingToken(JWTToken);
    const user = await userServices.findUserById(userId);
    req.user = user;
    next();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

module.exports = authenticate;
