import React, { useEffect, useState } from "react";
import CartProducts from "../../components/CartProducts/CartProducts";
import Button from "@mui/material/Button";
import PaymentIcon from "@mui/icons-material/Payment";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCartItems, getPrice } from "../../redux/features/cartSlice.js";
import { getCookieValue } from "../../config/cookies.js";
import CircularProgress from "@mui/material/CircularProgress";

export default function Cart() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.cart);
  const cartItems = state?.cartItems?.cart?.cartItems;
  const noOfCartItems = state?.noOfCartItems;
  const JWT = getCookieValue("JWT");

  useEffect(() => {
    if (JWT && !cartItems) {
      dispatch(getCartItems());
      dispatch(getPrice());
    }
  }, [cartItems]);

  const navigate = useNavigate();
  return (
    <div className="max-w-7xl mx-auto md:px-4 p-2 flex flex-col py-3">
      <div className="md:grid md:grid-cols-3">
        {/* Products */}
        <div className="col-span-2 space-y-4">
          {state.noOfCartItems == 0 && (
            <div className="flex justify-center py-3">
              <p className="text-gray-400 text-xl">Cart is empty</p>
            </div>
          )}
          {!state.loading
            ? cartItems?.map((item, ind) => {
                const product = item.product;
                const maxQuantityOfASpecificSize = product?.sizes?.filter(
                  (size) => {
                    return (
                      size.name.toUpperCase() === item?.size?.toUpperCase()
                    );
                  }
                );

                return (
                  <CartProducts
                    key={ind}
                    img={product?.imageURL}
                    productName={product?.title}
                    size={
                      item?.size.toUpperCase() != "NONE"
                        ? item?.size.toUpperCase()
                        : "Not applicable"
                    }
                    price={product?.price}
                    discount={product?.discountPresent}
                    sellingPrice={product?.discountedPrice}
                    seller={null}
                    maxQuantity={
                      maxQuantityOfASpecificSize.length > 0
                        ? maxQuantityOfASpecificSize[0].quantity
                        : product.quantity
                    }
                    cartItemId={item._id}
                    currentQuantity={item.quantity}
                  />
                );
              })
            : state.noOfCartItems != 0 && <span>Loading ...</span>}
        </div>
        {/* Checkout */}
        <div className="md:col-span-1">
          <div className="w-full py-5 px-5 border space-y-5 md:ml-3">
            {!state.loadingPrice ? (
              <>
                <div className="flex justify-between">
                  <span className="font-bold">Price</span>
                  <span className="font-semibold">
                    ₹{state.priceInfo?.totalPrice}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Discount</span>
                  <span className="font-semibold text-green-500">
                    {" "}
                    -₹{state.priceInfo?.discount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Delivery charge</span>
                  <span
                    className={`font-semibold ${
                      !state.priceInfo?.delivery
                        ? "text-green-500"
                        : "text-black"
                    }`}
                  >
                    {" "}
                    {!state.priceInfo?.delivery
                      ? "Free"
                      : state.priceInfo?.delivery}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-extrabold">Total amount</span>
                  <span className="font-extrabold">
                    ₹{state.priceInfo?.totalDiscountPrice}
                  </span>
                </div>
                <div className="flex justify-between">
                  {noOfCartItems > 0 && (
                    <Button
                      variant="text"
                      sx={{
                        bgcolor: "#4f46e5",
                        color: "white",
                        width: "100%",
                        "&:hover": { bgcolor: "#3d35c6" },
                      }}
                      startIcon={<PaymentIcon />}
                      onClick={() => navigate(`/checkout?step=1`)}
                    >
                      Buy
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <div className="w-full h-full flex justify-center items-center">
                <CircularProgress />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
