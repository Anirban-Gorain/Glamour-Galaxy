import React from "react";
import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";

export default function Review({ review, rating, userName }) {
  return (
    <div className="flex flex-col w-full p-5">
      <div className="flex justify-between">
        <h3 className="text-sm font-semibold text-gray-500">{userName}</h3>
        <Rating name="read-only" readOnly value={rating} />
      </div>
      <div className="mt-3 border-b pb-4">{review}</div>
    </div>
  );
}
