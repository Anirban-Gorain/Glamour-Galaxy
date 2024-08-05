import React, { useCallback, useEffect, useRef } from "react";
import { PaymentForm, CreditCard } from "react-square-web-payments-sdk";
import { api } from "../../config/api";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getCartItems, getPrice } from "../../redux/features/cartSlice";

const Payment = ({ setPaymentState }) => {
  const appId = import.meta.env.VITE_SQUARE_APP_ID;
  const locationId = "main";
  const { deliveryAddress } = useSelector((state) => state.address);
  const dispatch = useDispatch();

  // This following function is a payment handler which will be called when then tokenization process will be completed, token (which has been generated from card number, Ex, CVV) and verifiedBuyer will be passed as a arguments to this function.

  const paymentHandler = useCallback(async (token, verifiedBuyer) => {
    setPaymentState((prev) => ({ ...prev, isPaymentProcessing: true }));

    const response = await api.post("/payment/process", {
      token: token.token,
      deliveryAddress,
    });

    setPaymentState((prev) => ({
      ...prev,
      isPaymentProcessing: false,
      error: response.error ? true : null,
      success: !response.error ? true : null,
    }));

    dispatch(getCartItems());
    dispatch(getPrice());
  }, []);

  return (
    <PaymentForm
      applicationId={appId}
      locationId={locationId}
      cardTokenizeResponseReceived={paymentHandler}
    >
      <CreditCard
        buttonProps={{
          css: {
            backgroundColor: "#463ed6",
          },
        }}
      />
    </PaymentForm>
  );
};

export default Payment;
