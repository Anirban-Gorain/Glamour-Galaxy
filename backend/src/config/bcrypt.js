const bcrypt = require("bcrypt");

async function hashPassword(plainTextPass) {
  try {
    const hashPass = await bcrypt.hash(plainTextPass, 10);
    return hashPass;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function comparePassword(plainTextPass, hashPass) {
  try {
    const check = await bcrypt.compare(plainTextPass, hashPass);
    return check;
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = { hashPassword, comparePassword };
