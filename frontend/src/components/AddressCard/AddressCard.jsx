import React from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export default function AddressCard({
  fullName,
  landMark,
  city,
  state,
  zipCode,
  phnNo,
  showButton,
  selected,
  handler,
  addressId,
}) {
  const navigate = useNavigate();

  return (
    <div
      className={`border-2 ${
        selected ? "border-gray-300" : "border-gray-50"
      } p-3 space-y-3 rounded-md mr-2`}
    >
      <p>
        <span className="font-bold">{fullName}</span>
      </p>
      <p>
        <span className="font-semibold">
          {state}, {city}, {landMark}, {zipCode}.
        </span>
      </p>
      <p className="flex flex-col gap-y-1 ">
        <span className="font-semibold">Phone number</span>
        <span className="font-bold">{phnNo}</span>
      </p>

      {showButton && (
        <Button
          onClick={() => {
            handler();
            navigate("/checkout?step=2");
          }}
          sx={{
            bgcolor: "#4f46e5",
            color: "white",
            "&:hover": {
              bgcolor: "#463ed6", // Example hover background color
              color: "white",
            },
          }}
        >
          {selected ? "Selected" : "Place here"}
        </Button>
      )}
    </div>
  );
}
