import React from "react";
import { Routes, Route } from "react-router-dom";
import Navigation from "../components/Navigation/Navigation";
import Footer from "../components/Footer/Footer";
import Home from "../pages/Home/Home";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import Filter from "../pages/Filter/Filter";
import Checkout from "../pages/Checkout/Checkout";
import TrackOrder from "../pages/TrackOrder/TrackOrder";
import Cart from "../pages/Cart/Cart";
import { OrderDetails } from "../pages/OrderDetails/OrderDetails";
import { ProtectedRoute } from "../components/ProtectedRoute/ProtectedRoute";
import UserDirection from "../components/UserDirection/UserDirection";

export default function CustomerRoutes() {
  return (
    <>
      <Navigation />
      <UserDirection />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/product/:productID" element={<ProductDetails />}></Route>
        <Route path="/:level1/:level2/:level3" element={<Filter />}></Route>

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/track-order"
          element={
            <ProtectedRoute>
              <TrackOrder />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/track-order/:orderId"
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </>
  );
}
