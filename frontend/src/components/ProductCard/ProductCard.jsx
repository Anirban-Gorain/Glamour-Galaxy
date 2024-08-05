import React, { memo } from "react";
import { useNavigate } from "react-router-dom";

function ProductCard({
  imagePath,
  productName,
  productDescription,
  // payableAmount,
  originalPrice,
  rateOfDiscount,
  productID,
}) {
  const payableAmount = parseInt(
    (originalPrice * (100 - rateOfDiscount)) / 100
  );

  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        navigate(`/product/${productID}`);
      }}
      className="group w-[220px]  bg-white p-2 border-gray-300 border-2 rounded-md hover:shadow-xl transition-all cursor-pointer"
    >
      <div className="w-full h-[270px]">
        <img
          src={imagePath}
          alt="Poster"
          className="object-cover object-top w-full h-full rounded-md"
        />
      </div>
      <div className="p-3 transition-all group-hover:-translate-x-2 group-hover:-translate-y-2 ">
        {/* Product name */}
        <h3 className="mb-2 font-bold text-lg line-clamp-1">{productName}</h3>
        {/* Product description */}
        <p className="line-clamp-2 mb-2">{productDescription}</p>
        {/* Product pricing details */}
        <p className="space-x-2">
          {/* Payable amount */}
          <span className="font-bold">₹{payableAmount}</span>
          {/* Original price */}
          {rateOfDiscount != 0 && (
            <span className="line-through text-gray-500">₹{originalPrice}</span>
          )}
          {/* Rate of discount */}
          {rateOfDiscount != 0 && (
            <span className="text-green-600 font-semibold">
              {rateOfDiscount}% off
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

export default memo(ProductCard);
