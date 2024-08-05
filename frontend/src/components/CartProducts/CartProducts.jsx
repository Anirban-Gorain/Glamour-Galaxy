import React, { useRef, useState } from "react";
import Button from "@mui/material/Button";
import PaymentIcon from "@mui/icons-material/Payment";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { incQuantity, removeFromCart } from "../../redux/features/cartSlice";
import { decQuantity } from "../../redux/features/cartSlice";
import { getPrice } from "../../redux/features/cartSlice";
import { useDispatch, useSelector } from "react-redux";

export default function CartProducts({
  img,
  productName,
  size,
  seller,
  sellingPrice,
  price,
  discount,
  maxQuantity,
  cartItemId,
  currentQuantity,
}) {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.cart);
  const count = useRef(currentQuantity);

  const incHandler = () => {
    if (count.current + 1 > maxQuantity) return;
    count.current = count.current + 1;
    dispatch(incQuantity({ cartItemId, quantity: count.current }));
    dispatch(getPrice());
  };

  const decHandler = () => {
    if (count.current == 1) return;
    count.current = count.current - 1;
    dispatch(decQuantity({ cartItemId, quantity: count.current }));
    dispatch(getPrice());
  };

  const removeCartItem = () => {
    dispatch(removeFromCart({ cartItemId, cartId: state.cartId }));
  };

  return (
    <div className="w-full p-2 shadow-md">
      <div className="flex gap-x-7">
        <div className="flex flex-col h-">
          <img className="w-28 object-cover object-top" src={img} alt="" />
        </div>
        <div className="flex flex-col gap-y-3">
          <span className="font-bold text-gray-900 text-xl mt-2">
            {productName}
          </span>
          <span className="font-semibold text-gray-700 text-base">
            Size - {size}
          </span>
          {seller && (
            <span className="font-semibold text-gray-700 text-base">
              Seller - {seller}
            </span>
          )}
          {/* Quantity button */}
          {maxQuantity && (
            <div className="flex items-center gap-x-3">
              <span className="font-semibold text-gray-700 text-base">
                Quantity -
              </span>
              <Button
                onClick={decHandler}
                sx={{
                  border: "1px solid gray",
                }}
                disabled={
                  state.cartItemCountLoading || count.current == 1
                    ? true
                    : false
                }
              >
                <RemoveIcon sx={{ color: "#3d35c6", fontSize: "16px" }} />
              </Button>
              <span className="font-bold w-5 text-center select-none">
                {count.current}
              </span>
              <Button
                onClick={incHandler}
                sx={{
                  border: "1px solid gray",
                  display: "flex", // Use flexbox
                  justifyContent: "center", // Center horizontally
                  alignItems: "center",
                }}
                disabled={
                  state.cartItemCountLoading || count.current == maxQuantity
                    ? true
                    : false
                }
              >
                <AddIcon sx={{ color: "#3d35c6", fontSize: "16px" }} />
              </Button>
            </div>
          )}
          {/* Price details */}
          <p className="flex gap-x-3 flex-wrap">
            <span className="text-base tracking-tight text-gray-900 font-bold">
              ₹{sellingPrice}
            </span>
            <span className="text-base tracking-tight text-gray-900 line-through font-bold">
              ₹{price}
            </span>
            <span className="text-base tracking-tight text-green-500 font-bold">
              {discount}% off
            </span>
          </p>
        </div>
        {maxQuantity && (
          <Button
            sx={{
              marginLeft: "auto",
              alignSelf: "end",
            }}
            onClick={removeCartItem}
          >
            Remove from cart
          </Button>
        )}
      </div>
    </div>
  );
}
