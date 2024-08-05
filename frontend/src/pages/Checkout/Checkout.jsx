import React, { useState, useEffect } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import AddressCard from "../../components/AddressCard/AddressCard";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import CartProducts from "../../components/CartProducts/CartProducts";
import PaymentIcon from "@mui/icons-material/Payment";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../../config/api";
import { useDispatch, useSelector } from "react-redux";
import {
  addAddress,
  getAllAddresses,
  selectDeliveryAddress,
} from "../../redux/features/addressSlice";
import Payment from "../../components/Payment/Payment";
import CircularProgress from "@mui/material/CircularProgress";
import paymentSuccess from "../../assets/paymentSuccess.png";
import paymentFail from "../../assets/paymentFail.png";

const steps = ["Delivery address", "Order summary", "Payment"];
const textFiledStyles = {
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#4f46e5", // Change the outline color when focused
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#4f46e5", // Change the legend color
  },
};

// Component

function AddAddress() {
  const [formData, setFormData] = useState({
    fName: "",
    lName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    mobile: "",
  });
  function handleForm(e) {
    const value = e.target.value;
    const id = e.target.id;

    setFormData((prev) => ({ ...prev, [id]: value }));
  }
  const dispatch = useDispatch();
  const addressState = useSelector((state) => state.address);

  return (
    <>
      <div className="flex justify-between">
        <TextField
          id="fName"
          label="First name"
          variant="outlined"
          sx={{
            flexBasis: "49%",
            ...textFiledStyles,
          }}
          onChange={(e) => handleForm(e)}
        />
        <TextField
          sx={{ flexBasis: "49%", ...textFiledStyles }}
          id="lName"
          label="Last name"
          variant="outlined"
          onChange={(e) => handleForm(e)}
        />
      </div>
      <div>
        <TextField
          sx={{
            width: "100%",
            "& .MuiInputBase-root": {
              height: "100px", // Change the height of the TextField
            },
            ...textFiledStyles,
          }}
          id="address"
          label="Address"
          variant="outlined"
          onChange={(e) => handleForm(e)}
        />
      </div>
      <div className="flex justify-between">
        <TextField
          id="city"
          label="City"
          variant="outlined"
          sx={{
            flexBasis: "49%",
            ...textFiledStyles,
          }}
          onChange={(e) => handleForm(e)}
        />
        <TextField
          sx={{ flexBasis: "49%", ...textFiledStyles }}
          id="state"
          label="State"
          variant="outlined"
          onChange={(e) => handleForm(e)}
        />
      </div>
      <div className="flex justify-between">
        <TextField
          id="zipCode"
          label="Zip/Postal code"
          variant="outlined"
          sx={{
            flexBasis: "49%",
            ...textFiledStyles,
          }}
          onChange={(e) => handleForm(e)}
        />
        <TextField
          sx={{ flexBasis: "49%", ...textFiledStyles }}
          id="mobile"
          label="Phone number"
          variant="outlined"
          onChange={(e) => handleForm(e)}
        />
      </div>
      <div>
        <Button
          sx={{
            bgcolor: "#4f46e5",
            color: "white",
            "&:hover": {
              bgcolor: "#463ed6", // Example hover background color
              color: "white",
            },
          }}
          onClick={() => dispatch(addAddress(formData))}
        >
          {addressState.isNewAddressLoading ? "Adding..." : "Add address"}
        </Button>
      </div>
    </>
  );
}

// Component

function OrderPricingDetails({
  price,
  discount,
  deliveryCharge,
  total,
  showPayButton,
}) {
  const navigate = useNavigate();
  return (
    <div className="space-y-3 border p-3">
      <div className="flex justify-between">
        <span className="font-bold">Price</span>
        <span className="font-semibold">₹ {price}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-bold">Discount</span>
        <span className="font-semibold text-green-500"> -₹ {discount}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-bold">Delivery charge</span>
        <span
          className={`font-semibold ${
            !deliveryCharge ? "text-green-500" : "text-black"
          }`}
        >
          {" "}
          {!deliveryCharge ? "Free" : deliveryCharge}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="font-extrabold">Total amount</span>
        <span className="font-extrabold">
          ₹ {total + (!deliveryCharge ? 0 : deliveryCharge)}
        </span>
      </div>
      <div className="flex justify-between">
        {showPayButton && (
          <Button
            variant="text"
            sx={{
              bgcolor: "#4f46e5",
              color: "white",
              width: "100%",
              "&:hover": { bgcolor: "#3d35c6" },
            }}
            startIcon={<PaymentIcon />}
            onClick={() => navigate("?step=3")}
          >
            Proceed to pay
          </Button>
        )}
      </div>
    </div>
  );
}

export default function Checkout() {
  const location = useLocation();
  const [whichStep, setWhichStep] = useState(0);
  const addressState = useSelector((state) => state.address);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const dispatch = useDispatch();
  const addressStore = useSelector((state) => state.address);
  const cartStore = useSelector((state) => state.cart);
  const cartItems = cartStore?.cartItems?.cart?.cartItems;
  const {
    totalPrice = "Loading...",
    totalDiscountPrice = "Loading...",
    discount = "Loading...",
  } = cartStore?.priceInfo || {};
  const { city, fName, lName, address, mobile, state, zipCode } =
    addressStore.deliveryAddress;
  const [paymentState, setPaymentState] = useState({
    isPaymentProcessing: false,
    error: !true,
    success: !true,
  });

  useEffect(() => {
    const paramsValues = location.search
      .slice(1)
      .split("&")
      .map((keyAndValue) => {
        const temp = keyAndValue.split("=");
        return { key: temp[0], value: temp[1] };
      });
    const step = paramsValues.filter((pair) => {
      if (pair.key == "step") return true;
    });

    if (step.length > 0) setWhichStep(step[0].value);
  }, [location.search]);

  useEffect(() => {
    setAddresses(addressState.savedAddresses);
  }, [addressState.savedAddresses]);

  useEffect(() => {
    dispatch(getAllAddresses());
    // dispatch(getCartItems());
  }, []);

  return (
    <div className="max-w-7xl mx-auto md:px-4 p-2 py-3 ">
      <div className="mt-4">
        <Stepper activeStep={Number(whichStep)}>
          {steps.map((label, index) => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </div>

      <div className="mt-4 md:grid md:grid-cols-3 flex flex-col">
        <div className="md:col-span-1  space-y-3 h-[400px] overflow-y-auto">
          {/* Set of saved address */}
          {whichStep == 1 &&
            addresses.map((address, ind) => {
              return (
                <AddressCard
                  key={ind}
                  city={address.city}
                  fullName={address.fName + " " + address.lName}
                  landMark={address.address}
                  phnNo={address.mobile}
                  state={address.state}
                  zipCode={address.zipCode}
                  showButton={whichStep == 1 ? true : false}
                  selected={selectedAddress === address._id}
                  addressId={address._id}
                  handler={() => {
                    setSelectedAddress(address._id);
                    dispatch(
                      selectDeliveryAddress({ ...address, _id: address._id })
                    );
                  }}
                />
              );
            })}

          {/* The address where the order will be placed and Pricing details */}
          {(whichStep == 2 || whichStep == 3) && (
            <>
              <AddressCard
                city={city}
                fullName={fName + " " + lName}
                landMark={address}
                phnNo={mobile}
                state={state}
                zipCode={zipCode}
                showButton={whichStep == 1 ? true : false}
              />
              <OrderPricingDetails
                price={totalPrice}
                discount={discount}
                deliveryCharge={0}
                total={totalDiscountPrice}
                showPayButton={whichStep == 2 ? true : false}
              />
            </>
          )}
        </div>
        <div
          className="md:col-span-2 flex flex-col  md:px-5 mt-3 gap-y-5"
          id="paymentForm"
        >
          {/* Add an address */}
          {whichStep == 1 && <AddAddress />}
          {/* List of all the products to be brought */}
          {whichStep == 2 &&
            cartItems?.map((item, ind) => (
              <CartProducts
                img={item.product.imageURL}
                productName={item.product.title}
                price={item.product.price}
                discount={item.product.discountPresent}
                sellingPrice={item.product.discountedPrice}
                // seller={"New delhi Pheonix mall"}
                size={item.size}
              />
            ))}
          {whichStep == 3 && <Payment setPaymentState={setPaymentState} />}
          <div className="w-full flex flex-col justify-center items-center mt-2 space-y-2">
            {paymentState.isPaymentProcessing && <CircularProgress />}
            {paymentState.error && (
              <>
                <img className="w-40" src={paymentFail} />
                <p>OOPS! Payment failed try again later</p>
              </>
            )}
            {paymentState.success && (
              <>
                <img className="w-40" src={paymentSuccess} />
                <p>Payment successful</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
