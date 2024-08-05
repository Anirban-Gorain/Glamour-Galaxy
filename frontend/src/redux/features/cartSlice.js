import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/api";

const initialState = {
  cartItems: [],
  priceInfo: {},
  noOfCartItems: 0,
  error: null,
  loading: false,
  cartItemCountLoading: false,
  loadingPrice: false,
  cartId: null,
};

export const getCartItems = createAsyncThunk(
  "cart/getCartItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/user/cart/find");

      if (!response.data)
        throw rejectWithValue(
          "Unable to fetch data for cart from getCartItems"
        );

      return response.data;
    } catch (error) {
      throw rejectWithValue(error.message);
    }
  }
);

export const addToCart = createAsyncThunk("cart/addToCart", async () => {});

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (data, { rejectWithValue, getState }) => {
    try {
      const { cartItemId } = data;
      const cartItem = await api.delete(`/api/user/cart/delete/${cartItemId}`);

      if (!cartItem) throw rejectWithValue("Did not get cart or cart item");

      let cartItems = getState();
      cartItems = cartItems.cart.cartItems.cart.cartItems;
      cartItems = [...cartItems];

      cartItems = cartItems.filter((cartItem) => {
        return cartItem._id !== cartItemId;
      });

      await api.patch("/api/user/cart/update-cart", {
        cartItems,
      });

      return cartItems;
    } catch (error) {
      throw rejectWithValue(error.message);
    }
  }
);

export const incQuantity = createAsyncThunk(
  "cart/incQty",
  async (data, { rejectWithValue }) => {
    try {
      const { cartItemId, quantity } = data;
      const response = await api.patch(`/api/user/cart/update/${cartItemId}`, {
        quantity,
      });

      if (!response) {
        throw rejectWithValue("There is some problem in incQuantity");
      }

      return response;
    } catch (error) {
      throw rejectWithValue(
        "There is some problem in incQuantity" + error.message
      );
    }
  }
);

export const decQuantity = createAsyncThunk(
  "cart/decQty",
  async (data, action) => {
    try {
      const { cartItemId, quantity } = data;
      const response = await api.patch(`/api/user/cart/update/${cartItemId}`, {
        quantity,
      });

      if (!response) {
        throw rejectWithValue("There is some problem in incQuantity");
      }

      return response;
    } catch (error) {
      throw rejectWithValue(
        "There is some problem in incQuantity" + error.message
      );
    }
  }
);

export const getPrice = createAsyncThunk(
  "cart/getPrice",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/user/cart/find");

      if (!response.data)
        throw rejectWithValue(
          "Unable to fetch data for cart from getCartItems"
        );

      return response.data;
    } catch (error) {
      throw rejectWithValue(error.message);
    }
  }
);

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCart: (state, _) => {
      state.cartItems = [];
      state.priceInfo = {};
      state.noOfCartItems = 0;
      state.error = null;
      state.loading = false;
      state.cartItemCountLoading = false;
      state.loadingPrice = false;
      state.cartId = null;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getCartItems.pending, (state) => {
      state.cartItems = [];
      // state.noOfCartItems = 0;
      state.error = null;
      state.loading = true;
    });
    builder.addCase(getCartItems.fulfilled, (state, action) => {
      state.cartItems = action?.payload;
      state.noOfCartItems = action?.payload.cart.cartItems.length;
      state.error = null;
      state.loading = false;
      state.cartId = action.payload.cart._id;
    });
    builder.addCase(getCartItems.rejected, (state, action) => {
      state.cartItems = [];
      state.noOfCartItems = 0;
      state.error = action.payload;
      state.loading = false;
      state.noOfCartItems = 0;
    });

    // Different states for incQuantity

    builder.addCase(incQuantity.pending, (state, action) => {
      state.error = null;
      state.cartItemCountLoading = true;
    });
    builder.addCase(incQuantity.fulfilled, (state, action) => {
      state.error = null;
      state.cartItemCountLoading = false;
      // state.cartItems = null;
    });
    builder.addCase(incQuantity.rejected, (state, action) => {
      state.error = action.payload;
      state.cartItemCountLoading = false;
    });

    // Different states for decQuantity

    builder.addCase(decQuantity.pending, (state, action) => {
      state.error = null;
      state.cartItemCountLoading = true;
    });
    builder.addCase(decQuantity.fulfilled, (state, action) => {
      state.error = null;
      state.cartItemCountLoading = false;
      // state.cartItems = null;
    });
    builder.addCase(decQuantity.rejected, (state, action) => {
      state.error = action.payload;
      state.cartItemCountLoading = false;
    });

    // Different states for getCart

    builder.addCase(getPrice.pending, (state, action) => {
      state.error = null;
      state.loadingPrice = true;
    });
    builder.addCase(getPrice.fulfilled, (state, action) => {
      state.error = null;
      state.loadingPrice = false;
      state.priceInfo = action.payload.cart;
    });
    builder.addCase(getPrice.rejected, (state, action) => {
      state.error = action.payload;
      state.loadingPrice = false;
      state.priceInfo = {};
    });

    // Different states for removeCart

    builder.addCase(removeFromCart.pending, (state, action) => {
      state.error = null;
    });
    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      state.error = null;
      state.cartItems = action.payload;
      state.noOfCartItems = action?.payload?.cart?.cartItems?.length;
    });
    builder.addCase(removeFromCart.rejected, (state, action) => {
      state.error = null;
      state.cartItems = [];
    });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
