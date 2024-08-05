import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import API_BASE_URL, { api } from "../../config/api.js";
import { setCookie } from "../../config/cookies.js";

const initialState = {
  isLoggedIn: false,
  user: null,
  error: null,
  isLoading: false,
};

export const loginManual = createAsyncThunk(
  "auth/loginManual",
  async (credentials, { rejectWithValue }) => {
    try {
      const { email, password } = credentials;

      // Doing API call for login request

      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      if (!response.data) {
        throw rejectWithValue("Some error has been occurred");
      }

      // Setting the JWT token to the cookie

      setCookie("JWT", response.data.jwt);

      // This value returning from gere will be accessible loginManual.fulfilled

      return response.data;
    } catch (error) {
      throw rejectWithValue("This error from login manual" + error.message);
    }
  }
);

export const loginJWT = createAsyncThunk(
  "auth/loginJWT",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_BASE_URL}/api/users/profile`);

      if (!response.data) {
        throw rejectWithValue("Some error has been occurred");
      }

      return response.data;
    } catch (error) {
      throw rejectWithValue("This error from login JWT " + error.message);
    }
  }
);

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (credentials, { rejectWithValue }) => {
    try {
      const { fName, lName, email, password, mobile } = credentials;
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
        fName,
        lName,
        email,
        password,
        mobile,
      });

      console.log("The error is here");

      if (!response.data) {
        throw rejectWithValue("Some error has been occurred");
      }

      setCookie("JWT", response.data.token);

      console.log("The control is here ", response.data.token);

      return response.data;
    } catch (error) {
      throw rejectWithValue(error.message);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: (state, _) => {
      state.error = null;
      state.isLoading = false;
      state.isLoggedIn = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginManual.pending, (state, _) => {
      state.error = null;
      state.isLoading = true;
      state.user = null;
      state.isLoggedIn = false;
    });
    builder.addCase(loginManual.fulfilled, (state, action) => {
      state.error = false;
      state.isLoading = false;
      state.isLoggedIn = true;
      state.user = action.payload;
    });
    builder.addCase(loginManual.rejected, (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
      state.isLoggedIn = false;
      state.user = null;
    });

    // For login using JWT

    builder.addCase(loginJWT.pending, (state, _) => {
      state.error = null;
      state.isLoading = true;
      state.user = null;
      state.isLoggedIn = false;
    });
    builder.addCase(loginJWT.fulfilled, (state, action) => {
      state.error = false;
      state.isLoading = false;
      state.isLoggedIn = true;
      state.user = action.payload;
    });
    builder.addCase(loginJWT.rejected, (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
      state.isLoggedIn = false;
      state.user = null;
    });

    // For signup

    builder.addCase(signUp.pending, (state, _) => {
      state.error = null;
      state.isLoading = true;
      state.user = null;
      state.isLoggedIn = false;
    });
    builder.addCase(signUp.fulfilled, (state, action) => {
      state.error = false;
      state.isLoading = false;
      state.isLoggedIn = true;
      state.user = action.payload;
    });
    builder.addCase(signUp.rejected, (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
      state.isLoggedIn = false;
      state.user = null;
    });
  },
});

export const { logOut } = authSlice.actions;
export default authSlice.reducer;
