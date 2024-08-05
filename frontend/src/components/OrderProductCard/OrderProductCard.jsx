import React from "react";
import StarRateIcon from "@mui/icons-material/StarRate";
import { useNavigate } from "react-router-dom";

export default function OrderProductCard({
  imgSrc,
  productName,
  color,
  size,
  seller,
  price,
  quantity,
  productId,
}) {
  const navigate = useNavigate();

  return (
    <div className="w-full flex shadow-md p-3">
      <div className="flex gap-x-4">
        <img
          className="w-32 object-cover object-top rounded-md"
          src={imgSrc}
          alt=""
        />
        <div className="space-y-5 mt-3">
          <p className="text-lg font-semibold">{productName}</p>
          <p className="space-x-4 text-gray-400">
            <span>Color: {color}</span>
            <span>Size: {size}</span>
            {quantity && <span>Quantity: {quantity}</span>}
          </p>
          {seller && <p>Seller: {seller}</p>}
          <p className="text-lg font-semibold">₹{price}</p>
        </div>
      </div>

      <div className="ml-auto w-fit h-8 self-end flex items-center font underline cursor-pointer">
        <StarRateIcon sx={{ fontSize: "16px" }} />{" "}
        <span onClick={() => navigate(`/product/${productId}`)}>
          Rate and review this product
        </span>
      </div>
    </div>
  );
}
