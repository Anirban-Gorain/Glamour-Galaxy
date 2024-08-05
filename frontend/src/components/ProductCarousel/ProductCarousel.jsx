import React from "react";
import ProductCard from "../ProductCard/ProductCard";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { oneSentence, convertToNumber } from "../../stringUtilities";

function ProductCarousel({ sectionHeading, products }) {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 6,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  return (
    <div className="my-5 px-5">
      <h1 className="text-3xl font-semibold">
        {sectionHeading ? sectionHeading : "Not Added"}
      </h1>
      <Carousel responsive={responsive} keyBoardControl={true}>
        {products.map((product, ind) => {
          return (
            <ProductCard
              key={ind}
              imagePath={product.imageURL}
              productName={oneSentence(product.title)}
              productDescription={oneSentence(product.brand)}
              originalPrice={convertToNumber(product.price)}
              rateOfDiscount={convertToNumber(product.discountPresent)}
              productID={product._id}
            />
          );
        })}
      </Carousel>
    </div>
  );
}

export default ProductCarousel;
