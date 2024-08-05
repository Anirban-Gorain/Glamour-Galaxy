import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../config/api";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  CircularProgress,
} from "@mui/material";
import AddressCard from "../../components/AddressCard/AddressCard";
import OrderProductCard from "../../components/OrderProductCard/OrderProductCard";

const steps = [
  "Placed",
  "Conformed",
  "Shipped",
  "Out of delivery",
  "Delivered",
];

export const OrderDetails = () => {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [isOrderCancelled, setIsOrderCancelled] = useState(false);
  const [stepperValue, setStepperValue] = useState(1);
  const [cancelationProcess, setCancelationProcess] = useState({
    cancelationProcessStarted: false,
  });

  useEffect(() => {
    const getOrderDetails = async () => {
      if (!orderId) return;

      setCancelationProcess({
        cancelationProcessStarted: false,
        isCancelled: false,
      });

      setOrderDetails(null);
      setIsOrderCancelled(false);
      const response = await api.get(`/api/user/order/${orderId}`);

      if (!response.data) return;

      const products = response.data.orderItems.map((item) => ({
        imageURL: item.product.imageURL,
        discountedPrice: item.discountedPrice,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        productId: item.product._id,
      }));

      const shippingAddress = {
        name:
          response.data.shippingAddress.fName +
          " " +
          response.data.shippingAddress.lName,
        address: response.data.shippingAddress.address,
        mobile: response.data.shippingAddress.mobile,
        state: response.data.shippingAddress.state,
        zip: response.data.shippingAddress.zipCode,
        city: response.data.shippingAddress.city,
      };

      setOrderDetails({
        shippingAddress,
        products,
      });
    };

    getOrderDetails();
  }, [orderId]);

  const cancelHandler = useCallback(async () => {
    setCancelationProcess({
      cancelationProcessStarted: true,
    });

    const response = await api.delete(`api/user/order/delete/${orderId}`);

    if (!response.data) return;

    setIsOrderCancelled(true);
    setCancelationProcess({
      cancelationProcessStarted: false,
    });
  }, [orderId]);

  return (
    <div className="max-w-7xl mx-auto md:px-4 p-2 flex flex-col py-3 space-y-7">
      {isOrderCancelled == false && (
        <div className="grid md:grid-cols-3 grid-cols-2">
          <div className="col-span-2 flex items-center">
            <Stepper activeStep={Number(stepperValue)} sx={{ width: "100%" }}>
              {steps.map((label, index) => {
                return (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
          </div>
          <div className="md:flex md:justify-end md:items-center space-y-5 space-x-2   md:space-y-0">
            <span></span>
            <Button
              sx={{
                width: "150px",
                bgcolor: "#4f46e5",
                color: "white",
                "&:hover": {
                  bgcolor: "#463ed6", // Example hover background color
                  color: "white",
                },
              }}
              onClick={cancelHandler}
            >
              {cancelationProcess.cancelationProcessStarted == false &&
                "Cancel"}
              {cancelationProcess.cancelationProcessStarted == true &&
                "Cancelling..."}
            </Button>
          </div>
        </div>
      )}
      <div className="border border-gray-100">
        {isOrderCancelled == false && orderDetails ? (
          <AddressCard
            city={orderDetails?.shippingAddress.city}
            fullName={orderDetails?.shippingAddress.name}
            landMark={orderDetails?.shippingAddress.address}
            phnNo={orderDetails?.shippingAddress.mobile}
            state={orderDetails?.shippingAddress.state}
            zipCode={orderDetails?.shippingAddress.zip}
            showButton={false}
          />
        ) : (
          isOrderCancelled == false && (
            <div className="w-full flex justify-center items-center p-6">
              <CircularProgress />
            </div>
          )
        )}
      </div>
      <div className="flex flex-col gap-y-3">
        {isOrderCancelled == false &&
          orderDetails?.products.map((product) => (
            <OrderProductCard
              key={product.productId}
              imgSrc={product.imageURL}
              productName="Women kurti"
              color={product.color}
              size={product.size}
              seller={undefined}
              price={product.discountedPrice}
              quantity={product.quantity}
              productId={product.productId}
            />
          ))}
      </div>

      {/* Cancelation message */}

      {isOrderCancelled && (
        <div className="w-full flex justify-center">
          <p className="text-xl font-bold">
            Your order has been cancelled successfully
          </p>
        </div>
      )}
    </div>
  );
};
