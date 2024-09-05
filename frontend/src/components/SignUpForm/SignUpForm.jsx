import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useForm } from "react-hook-form";
import { signUp } from "../../redux/features/authSlice";
import { useDispatch } from "react-redux";
import { getCartItems, getPrice } from "../../redux/features/cartSlice";

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  async function onSubmit(data) {
    await dispatch(signUp(data));

    dispatch(getCartItems());
    dispatch(getPrice());
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col bg-white p-7 gap-y-5 w-[30%]  md:min-w-[530px] min-w-[350px]"
    >
      <div className="width-[100%] flex gap-x-2 flex-wrap md:flex-row flex-col gap-y-3 justify-between">
        <TextField
          label="First name"
          variant="outlined"
          {...register("fName", {
            required: {
              value: true,
              message: "First name can not be empty",
            },
            minLength: {
              value: 5,
              message: "First name length should be grater than 5 characters",
            },
            maxLength: {
              value: 10,
              message: "First name length at max can be 10 characters",
            },
            pattern: {
              value: /^[a-zA-Z]+$/,
              message: "First name can contain only alphabets",
            },
          })}
        />
        <TextField
          label="Last name"
          variant="outlined"
          {...register("lName", {
            required: {
              value: true,
              message: "Last name can not be empty",
            },
            minLength: {
              value: 5,
              message: "Last name length should be grater than 5 characters",
            },
            maxLength: {
              value: 10,
              message: "Last name length at max can be 10 characters",
            },
            pattern: {
              value: /^[a-zA-Z]+$/,
              message: "Last name can contain only alphabets",
            },
          })}
        />
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
          label="Password"
          variant="outlined"
          fullWidth
        />
      </div>
      <div>
        <TextField
          {...register("mobile", {
            required: {
              value: true,
              message: "Phone number is required",
            },
            minLength: {
              value: 10,
              message: "Phone number length must be equal to 10",
            },
            maxLength: {
              value: 10,
              message:
                "Length of phone number can not exist more than 10 digits",
            },
            pattern: {
              value: /^[0-9]+$/,
              message: "Number can contain only digits",
            },
          })}
          label="Phone number"
          variant="outlined"
          fullWidth
        />
      </div>
      <div>
        {Object.keys(errors).length > 0 && (
          <p className="text-red-600 font-bold text-center">
            {errors[Object.keys(errors)[0]].message}
          </p>
        )}
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
        >
          Sign up
        </Button>
      </div>
    </form>
  );
}
