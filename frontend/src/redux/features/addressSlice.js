import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API_BASE_URL, { api } from "../../config/api.js";

const initialState = {
  savedAddresses: [],
  deliveryAddress: {
    city: null,
    fName: null,
    lName: null,
    address: null,
    mobile: null,
    state: null,
    zipCode: null,
  },
  isNewAddressLoading: false,
  newAddressError: null,
  isLoadingSavedAddresses: false,
  savedAddressError: null,
};

export const addAddress = createAsyncThunk(
  "addresses/addAddress",
  async (info, { rejectWithValue }) => {
    try {
      const response = await api.post(`/address/add`, info);
      return response.data.content;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getAllAddresses = createAsyncThunk(
  "addresses/getAllAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/address/get`);
      return response.data.content;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    selectDeliveryAddress: (state, action) => {
      state.deliveryAddress = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Add address
    builder.addCase(addAddress.pending, (state, _) => {
      state.isNewAddressLoading = true;
      state.newAddressError = null;
    });
    builder.addCase(addAddress.fulfilled, (state, action) => {
      state.isNewAddressLoading = false;
      state.newAddressError = null;
      state.savedAddresses = [action.payload, ...state.savedAddresses];
    });
    builder.addCase(addAddress.rejected, (state, action) => {
      state.isNewAddressLoading = false;
      state.newAddressError = action.payload;
    });

    // Get all address

    builder.addCase(getAllAddresses.pending, (state, _) => {
      state.isLoadingSavedAddresses = true;
      state.savedAddressError = null;
    });
    builder.addCase(getAllAddresses.fulfilled, (state, action) => {
      state.isLoadingSavedAddresses = false;
      state.savedAddressError = null;
      state.savedAddresses = action.payload;
    });
    builder.addCase(getAllAddresses.rejected, (state, action) => {
      state.isLoadingSavedAddresses = false;
      state.savedAddressError = action.payload;
    });
  },
});

export const { selectDeliveryAddress } = addressSlice.actions;
export default addressSlice.reducer;
