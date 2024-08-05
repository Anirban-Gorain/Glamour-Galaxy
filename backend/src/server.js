const app = require("./index");
const connectDB = require("./config/DB");
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server has started at port number", PORT);
  const res = connectDB();
  res.then(() => console.log("Database has been connected successfully"));
});
