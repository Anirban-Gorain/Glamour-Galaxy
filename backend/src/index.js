const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors());

const authRouters = require("./routes/auth.route.js");
app.use("/auth", authRouters);

const userRouters = require("./routes/user.route.js");
app.use("/api/users", userRouters);

const adminOrderRouters = require("./routes/adminOrder.route.js");
app.use("/api/admin/order", adminOrderRouters);

const userOrderRouters = require("./routes/userOrder.route.js");
app.use("/api/user/order", userOrderRouters);

const cartRouter = require("./routes/cart.route.js");
app.use("/api/user/cart", cartRouter);

const productRoute = require("./routes/product.route.js");
app.use("/api/admin/product", productRoute);

const reviewRoute = require("./routes/review.route.js");
app.use("/api/user/review", reviewRoute);

const ratingRoute = require("./routes/rating.route.js");
app.use("/api/user/rating", ratingRoute);

const categoryRoute = require("./routes/category.route.js");
app.use("/cate", categoryRoute);

const addressRoute = require("./routes/address.route.js");
app.use("/address", addressRoute);

const paymentRoute = require("./routes/payment.route.js");
app.use("/payment", paymentRoute);

module.exports = app;
