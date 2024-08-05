import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice.js";
import cartReducer from "./features/cartSlice.js";
import cateReducer from "./features/cateSlice.js";
import addressReducer from "./features/addressSlice.js";

export default configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    cate: cateReducer,
    address: addressReducer,
  },
});
