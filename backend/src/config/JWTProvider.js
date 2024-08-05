const JWT = require("jsonwebtoken");

const SECRET_KEY =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[{]}|;:,<.>/?";

async function getTokenUsingUserID(userID) {
  try {
    const token = JWT.sign({ userID }, SECRET_KEY, { expiresIn: "2d" });

    return token;
  } catch (error) {}
}

function getUserIDUsingToken(token) {
  try {
    const decodedToken = JWT.verify(token, SECRET_KEY);
    return decodedToken.userID;
  } catch (error) {}
}

module.exports = { getTokenUsingUserID, getUserIDUsingToken };
