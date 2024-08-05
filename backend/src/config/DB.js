const mongoose = require("mongoose");
const DBLink =
  "mongodb+srv://gorainanirban:PRLm98GSKMMbUK0F@glamorgalaxy.cj1wvcb.mongodb.net/?retryWrites=true&w=majority&appName=glamorgalaxy";

function connectDB() {
  return mongoose.connect(DBLink);
}

module.exports = connectDB;
