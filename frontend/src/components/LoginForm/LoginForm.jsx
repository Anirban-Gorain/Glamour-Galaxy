import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useForm } from "react-hook-form";
import { loginManual } from "../../redux/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";
import { getCartItems, getPrice } from "../../redux/features/cartSlice";

export default function LoginForm() {
  const [passVisibility, setPassVisibility] = useState(false);
  const iconStyles = {
    cursor: "pointer",
  };
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const toggleVisibility = () => setPassVisibility((prev) => !prev);
  const dispatch = useDispatch();
  const state = useSelector((state) => state.auth);

  async function onSubmit(data) {
    await dispatch(loginManual(data));

    // After sign up to load the cart
    dispatch(getCartItems());
    dispatch(getPrice());
  }

  return (
    <form
      className="flex flex-col bg-white p-7 gap-y-5 w-[30%] md:min-w-[530px] min-w-[350px]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <p>Login</p>
      </div>
      <div>
        <TextField
          {...register("email", {
            required: {
              value: true,
              message: "Email field can not be empty",
            },
            pattern: {
              value: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
              message: "Enter a valid email address",
            },
          })}
          label="Email"
          variant="outlined"
          fullWidth
        />
      </div>
      <div>
        <TextField
          label="Password"
          {...register("password", {
            required: {
              value: true,
              message: "Password field can not be empty",
            },
            minLength: {
              value: 8,
              message: "Password length must be grater than 8",
            },
            maxLength: {
              value: 15,
              message: "Password length can be at max 15",
            },
            pattern: {
              value: /(?=.*[A-Z])(?=.*[a-z])(?=.*[\W_])/,
              message:
                "Password must contain uppercase, lowercase, special characters and numbers",
            },
          })}
          variant="outlined"
          fullWidth
          type={passVisibility ? "text" : "password"}
          InputProps={{
            endAdornment: passVisibility ? (
              <VisibilityIcon sx={iconStyles} onClick={toggleVisibility} />
            ) : (
              <VisibilityOffIcon sx={iconStyles} onClick={toggleVisibility} />
            ),
          }}
        />
      </div>
      <div className="flex justify-center">
        <Button
          type="submit"
          fullWidth
          sx={{
            bgcolor: "#4f46e5",
            color: "white",
            "&:hover": {
              bgcolor: "#463ed6", // Example hover background color
              color: "white",
            },
          }}
          startIcon={
            state.isLoading ? (
              <CircularProgress sx={{ color: "white" }} size={20} />
            ) : null
          }
          disabled={state.isLoading ? true : false}
        >
          {state.isLoading ? "Loading..." : "Sign in"}
        </Button>
      </div>
      <div>
        {Object.keys(errors).length > 0 && (
          <p className="text-red-600 font-bold text-center">
            {errors[Object.keys(errors)[0]].message}
          </p>
        )}
      </div>
    </form>
  );
}
