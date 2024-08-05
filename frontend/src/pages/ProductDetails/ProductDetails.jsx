import { React, useState, useEffect, useId } from "react";
import { StarIcon } from "@heroicons/react/20/solid";
import { RadioGroup } from "@headlessui/react";
import Review from "../../components/Review/Review";
import RatingDetails from "../../components/RatingDetails/RatingDetails";
import { useParams } from "react-router-dom";
import { api } from "../../config/api.js";
import { replaceAll, capitalize } from "../../config/string.js";
import RatingAndReview from "../../components/RatingAndReview/RatingAndReview.jsx";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import { getCartItems, getPrice } from "../../redux/features/cartSlice.js";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductDetails() {
  // Fetching the product data

  const [product, setProduct] = useState({});
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [isAlreadyAddedToCart, setIsAlreadyAddedToCart] = useState(false);
  const notAllowedSizes = ["women_sarees"];
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { productID } = useParams();
  const dispatch = useDispatch();

  async function addToCartHandler() {
    try {
      const response = await api.post(`/api/user/cart/add`, {
        productID: productID,
        size: selectedSize ? selectedSize.name : "none",
        color: selectedColor.name,
      });

      if (response.data === "This items is already added") {
        setIsAlreadyAddedToCart(true);
        return;
      }

      setIsAlreadyAddedToCart(true);
      dispatch(getCartItems());
      dispatch(getPrice());
    } catch (error) {}
  }

  async function checkAlreadyAddedToCart() {
    const response = await api.post(`/api/user/cart/add`, {
      productID: productID,
    });

    if (response.data === "This items is already added") {
      setIsAlreadyAddedToCart(true);
      return;
    }
  }

  useEffect(() => {
    const helper = async () => await checkAlreadyAddedToCart();
    helper();
  }, []);

  useEffect(() => {
    const fetchProduct = async (productID) => {
      try {
        let response = await api.get(`/api/admin/product/get/${productID}`);
        response = response.data.content;

        const constructProduct = {
          name: response.title,
          sellingPrice: response.discountedPrice,
          price: response.price,
          discount: response.discountPresent,
          thirdLevelCategory: response.thirdLevelCategory,

          breadcrumbs: [
            {
              id: 1,
              name: capitalize(replaceAll("_", " ", response.topLevelCategory)),
            },
            {
              id: 2,
              name: capitalize(
                replaceAll("_", " ", response.secondLevelCategory)
              ),
            },
          ],

          images: [
            {
              src: response.imageURL,
            },
          ],

          colors: response.color.map((color) => ({ name: color })),
          sizes: response.sizes.map((size) => ({
            name: size.name,
            inStock:
              size.quantity > 0 &&
              !notAllowedSizes.includes(response.thirdLevelCategory)
                ? true
                : false,
          })),

          brand: response.brand,
        };

        setProduct(constructProduct);
        setSelectedColor(constructProduct.colors[1]);
        setSelectedSize(
          !notAllowedSizes.includes(response.thirdLevelCategory)
            ? constructProduct.sizes[1]
            : null
        );

        // Constructing a data structure in which for every unique user_id will stored its review, rating and name. map(_id, [name, review, rating])

        const feedbacks = new Map();
        const ratings = response.ratings;
        const reviews = response.reviews;
        const storeAllRatings = [];

        ratings.forEach((rating) => {
          const name = rating.user.fName + " " + rating.user.lName;
          const userID = rating.user._id;
          const ratingValue = rating.rating;

          feedbacks.set(userID, [name, ratingValue]);
          storeAllRatings.push(ratingValue);
        });

        reviews.forEach((review) => {
          const userID = review.user._id;
          const reviewText = review.review;

          const prev = feedbacks.get(userID);
          feedbacks.set(userID, [...prev, reviewText]);
        });

        // Finally the feedbacks are ready in the format of [name, rating, review]

        const temp = [];
        feedbacks.forEach((feedback) => temp.push(feedback));
        setFeedbacks(temp);
        setRatings(storeAllRatings);
      } catch (error) {}
    };

    fetchProduct(productID);
  }, [productID]);

  return (
    <div className="bg-white">
      <div className="pt-6">
        <nav aria-label="Breadcrumb">
          <ol
            role="list"
            className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8"
          >
            {product?.breadcrumbs?.map((breadcrumb) => (
              <li key={breadcrumb.id}>
                <div className="flex items-center">
                  <div className="mr-2 text-sm font-medium text-gray-900">
                    {breadcrumb.name}
                  </div>
                  <svg
                    width={16}
                    height={20}
                    viewBox="0 0 16 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-5 w-4 text-gray-300"
                  >
                    <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                  </svg>
                </div>
              </li>
            ))}
            <li className="text-sm">
              <a
                href={product.href}
                aria-current="page"
                className="font-medium text-gray-500 hover:text-gray-600"
              >
                {capitalize(replaceAll("_", " ", product.thirdLevelCategory))}
              </a>
            </li>
          </ol>
        </nav>

        {/* Image gallery */}
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          {/* Main product visible image box */}
          <div className="overflow-hidden rounded-lg lg:block">
            <img
              src={product?.images?.[0]?.src}
              alt={product?.images?.[0]?.alt}
              className="h-full w-full object-cover object-center"
            />
          </div>
          {/* Product function related box */}
          <div className="w-full h-full px-4 pt-5">
            <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {product.name}
              </h1>
            </div>

            {/* Options */}
            <div className="mt-4 lg:row-span-3 lg:mt-0">
              <h2 className="sr-only">Product information</h2>
              <div className="flex gap-x-5 items-center">
                <span className="text-3xl tracking-tight text-gray-900 font-bold">
                  ₹{product.sellingPrice}
                </span>
                <span className="text-xl tracking-tight text-gray-900 line-through font-bold">
                  ₹{product.price}
                </span>
                <span className="text-xl tracking-tight text-green-500 font-bold">
                  {product.discount}% off
                </span>
              </div>

              <form className="mt-10">
                {/* Colors */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Color</h3>

                  <RadioGroup
                    value={selectedColor}
                    onChange={setSelectedColor}
                    className="mt-4"
                  >
                    <RadioGroup.Label className="sr-only">
                      Choose a color
                    </RadioGroup.Label>
                    <div className="flex items-center space-x-3">
                      {product?.colors?.map((color) => (
                        <RadioGroup.Option
                          key={color.name}
                          value={color}
                          className={({ active, checked }) =>
                            classNames(
                              // color.selectedClass,
                              active && checked ? "ring ring-offset-1" : "",
                              !active && checked ? "ring-2" : "",
                              "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none"
                            )
                          }
                        >
                          <RadioGroup.Label as="span" className="sr-only">
                            {color.name}
                          </RadioGroup.Label>
                          <span
                            style={{ backgroundColor: color.name }}
                            aria-hidden="true"
                            className={classNames(
                              "h-8 w-8 rounded-full border border-black border-opacity-10"
                            )}
                          />
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                {/* Sizes */}
                <div className="mt-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">Size</h3>
                  </div>

                  <RadioGroup
                    value={selectedSize}
                    onChange={setSelectedSize}
                    className="mt-4"
                  >
                    <RadioGroup.Label className="sr-only">
                      Choose a size
                    </RadioGroup.Label>
                    <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                      {product?.sizes?.map((size) => (
                        <RadioGroup.Option
                          key={size.name}
                          value={size}
                          disabled={!size.inStock}
                          className={({ active }) =>
                            classNames(
                              size.inStock
                                ? "cursor-pointer bg-white text-gray-900 shadow-sm"
                                : "cursor-not-allowed bg-gray-50 text-gray-200",
                              active ? "ring-2 ring-indigo-500" : "",
                              "group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6"
                            )
                          }
                        >
                          {({ active, checked }) => (
                            <>
                              <RadioGroup.Label as="span">
                                {size.name}
                              </RadioGroup.Label>
                              {size.inStock ? (
                                <span
                                  className={classNames(
                                    // active ? "border-3" : "border-2",
                                    checked
                                      ? "border-indigo-500"
                                      : "border-transparent",
                                    "pointer-events-none absolute -inset-px rounded-md border-2"
                                  )}
                                  aria-hidden="true"
                                />
                              ) : (
                                <span
                                  aria-hidden="true"
                                  className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                                >
                                  <svg
                                    className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                                    viewBox="0 0 100 100"
                                    preserveAspectRatio="none"
                                    stroke="currentColor"
                                  >
                                    <line
                                      x1={0}
                                      y1={100}
                                      x2={100}
                                      y2={0}
                                      vectorEffect="non-scaling-stroke"
                                    />
                                  </svg>
                                </span>
                              )}
                            </>
                          )}
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                <Button
                  onClick={(e) => {
                    addToCartHandler();
                  }}
                  fullWidth
                  sx={{
                    marginTop: "15px",
                    bgcolor: "#4f46e5",
                    color: "white",
                    "&:hover": {
                      bgcolor: "#463ed6", // Example hover background color
                      color: "white",
                    },
                    "&.Mui-disabled": {
                      color: "white", // Keep text color white when disabled
                      opacity: 0.8,
                    },
                  }}
                  disabled={!isLoggedIn || isAlreadyAddedToCart ? true : false}
                >
                  {isAlreadyAddedToCart && "Added to cart"}
                  {isLoggedIn && !isAlreadyAddedToCart && "Add to cart"}
                  {!isLoggedIn && !isAlreadyAddedToCart && "Log in to add"}
                </Button>
              </form>
            </div>

            {/* Rating and Review giver. If use is signed up then only can post a review */}

            <div className="w-full mt-5 space-y-5">
              <h3 className="text-sm font-medium text-gray-900">
                Write a review and give ratings
              </h3>
              <RatingAndReview productID={productID} />
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
          {/* Product info */}
          <div className="py-10 lg:col-span-1 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
            {/* Description and details */}
            <div>
              <h3 className="text-sm font-medium text-gray-900">Brand</h3>

              <div className="space-y-6 mt-4">
                <p className="text-base text-gray-900">{product.brand}</p>
              </div>
            </div>
          </div>
          {/* Review */}
          <div className="w-full h-full">
            {/* Rating details */}
            <div>
              <h3 className="text-lg font-medium text-gray-900">Rating</h3>
              <RatingDetails allUserRatings={ratings} />
            </div>

            {/* Review */}
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Customer's reviews
              </h3>
              {feedbacks.length > 0 ? (
                feedbacks.map((feedback, i) => (
                  <Review
                    key={i}
                    userName={feedback[0]}
                    rating={feedback[1]}
                    review={feedback[2]}
                  />
                ))
              ) : (
                <div>No reviews are available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
