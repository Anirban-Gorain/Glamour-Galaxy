/*
  Filter has some error, that to be fixed later.
  Infinite scrolling should be implemented.
*/

import { Fragment, useEffect, useMemo, useState } from "react";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FunnelIcon, MinusIcon, PlusIcon } from "@heroicons/react/20/solid";
import Slider from "@mui/material/Slider";
import { filters, updateFilterData } from "./filterUtilities.js";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import { oneSentence, convertToNumber } from "../../stringUtilities.js";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../config/api.js";
import { replaceAll } from "../../config/string.js";
import { CircularProgress } from "@mui/material";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function debounce(func, delay) {
  let prevRef;

  return (...args) => {
    clearTimeout(prevRef);

    prevRef = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

const filterReset = {
  color: [],
  size: [],
  price: [undefined, undefined],
  discount: [undefined, undefined],
};

export default function Example() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [filterData, setFilterData] = useState(filterReset);
  const { level1, level2, level3 } = useParams();
  const navigate = useNavigate();

  function reflectFilterInURL(sectionId, value) {
    const oldQuery = window.location.search;
    const searchParams = new URLSearchParams(oldQuery);
    let filterValue = searchParams.getAll(sectionId);

    searchParams.delete(sectionId);

    switch (sectionId) {
      case "color":
      case "size":
        if (!filterValue.includes(value)) filterValue.push(value);
        else {
          const ind = filterValue.indexOf(value);
          filterValue.splice(ind, 1);
        }
        break;
      case "price":
      case "discount":
        filterValue = [];
        filterValue.push(value.join("to"));
        break;
    }

    filterValue.forEach((item) => {
      searchParams.append(sectionId, item);
    });

    const newQuery = searchParams.toString();
    navigate({ search: newQuery });
  }

  async function getProducts(filterData, level3) {
    setProducts([]);

    const response = await api.post(
      "/api/admin/product/get-products-on-query",
      {
        thirdLevelCategory: replaceAll("-", "_", level3),
        pageSize: 100,
        pageNo: 1,
        stock: undefined,
        minDiscount: filterData.discount[0],
        maxDiscount: filterData.discount[1],
        minPrice: filterData.price[0],
        maxPrice: filterData.price[1],
        color: filterData.color.join(","),
        sizes: filterData.size.length > 0 ? filterData.size : undefined,
      }
    );

    setProducts(response.data.content.content);
  }

  const getProductDebounce = useMemo(() => debounce(getProducts, 400), []);

  useEffect(() => {
    getProductDebounce(filterData, level3);
  }, [
    level1,
    level2,
    level3,
    filterData.color,
    filterData.discount,
    filterData.price,
    filterData.size,
  ]);

  return (
    <>
      <div className="bg-white">
        <div>
          {/* Mobile filter dialog */}
          <Transition.Root show={mobileFiltersOpen} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-40 lg:hidden"
              onClose={setMobileFiltersOpen}
            >
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>

              <div className="fixed inset-0 z-40 flex">
                <Transition.Child
                  as={Fragment}
                  enter="transition ease-in-out duration-300 transform"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transition ease-in-out duration-300 transform"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                    <div className="flex items-center justify-between px-4">
                      <h2 className="text-lg font-medium text-gray-900">
                        Filters
                      </h2>
                      <button
                        type="button"
                        className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                        onClick={() => setMobileFiltersOpen(false)}
                      >
                        <span className="sr-only">Close menu</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>

                    {/* Filters */}
                    <form className="mt-4 border-t border-gray-200">
                      <h3 className="sr-only">Categories</h3>
                      {filters.map((section) => (
                        <Disclosure
                          as="div"
                          key={section.id}
                          className="border-t border-gray-200 px-4 py-6"
                        >
                          {({ open }) => (
                            <>
                              <h3 className="-mx-2 -my-3 flow-root">
                                <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                                  <span className="font-medium text-gray-900">
                                    {section.name}
                                  </span>
                                  <span className="ml-6 flex items-center">
                                    {open ? (
                                      <MinusIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    ) : (
                                      <PlusIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    )}
                                  </span>
                                </Disclosure.Button>
                              </h3>
                              <Disclosure.Panel className="pt-6">
                                <div className="space-y-6">
                                  {section.options.map((option, optionIdx) => (
                                    <div
                                      key={option.value}
                                      className="flex items-center"
                                    >
                                      <input
                                        id={`filter-mobile-${section.id}-${optionIdx}`}
                                        name={`${section.id}`}
                                        defaultValue={option.value}
                                        type="checkbox"
                                        defaultChecked={option.checked}
                                        onChange={(e) => {
                                          reflectFilterInURL(
                                            section.id,
                                            e.target.value
                                          );
                                        }}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                      />
                                      <label
                                        htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                        className="ml-3 min-w-0 flex-1 text-gray-500"
                                      >
                                        {option.label}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                      ))}
                      {/* Price */}
                      <Disclosure
                        as="div"
                        className="border-t border-gray-200 px-4 py-6"
                      >
                        {({ open }) => (
                          <>
                            <h3 className="-mx-2 -my-3 flow-root">
                              <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                                <span className="font-medium text-gray-900">
                                  {"Price"}
                                </span>
                                <span className="ml-6 flex items-center">
                                  {open ? (
                                    <MinusIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <PlusIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  )}
                                </span>
                              </Disclosure.Button>
                            </h3>
                            <Disclosure.Panel className="pt-6">
                              <div className="space-y-6">
                                <div className="flex items-center">
                                  <Slider
                                    getAriaLabel={() => "Minimum distance"}
                                    valueLabelDisplay="on"
                                    disableSwap
                                    min={100}
                                    max={10000}
                                    name="price"
                                    value={filterData.price}
                                    onChange={(e, val, a) => {
                                      setFilterData((prev) => ({
                                        ...prev,
                                        price: val,
                                      }));
                                      reflectFilterInURL(
                                        "price",
                                        e.target.value
                                      );
                                    }}
                                    sx={{
                                      color: "#4f46e5", // Custom color
                                    }}
                                  />
                                </div>
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                      {/* Discount */}
                      <Disclosure
                        as="div"
                        className="border-t border-gray-200 px-4 py-6"
                      >
                        {({ open }) => (
                          <>
                            <h3 className="-mx-2 -my-3 flow-root">
                              <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                                <span className="font-medium text-gray-900">
                                  {"Discount"}
                                </span>
                                <span className="ml-6 flex items-center">
                                  {open ? (
                                    <MinusIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <PlusIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  )}
                                </span>
                              </Disclosure.Button>
                            </h3>
                            <Disclosure.Panel className="pt-6">
                              <div className="space-y-6">
                                <div className="flex items-center">
                                  <Slider
                                    getAriaLabel={() => "Minimum distance"}
                                    valueLabelDisplay="on"
                                    disableSwap
                                    step={10}
                                    min={0}
                                    max={90}
                                    name="discount"
                                    value={filterData.discount}
                                    onChange={(e, val, a) => {
                                      setFilterData((prev) => ({
                                        ...prev,
                                        discount: val,
                                      }));
                                      reflectFilterInURL(
                                        "discount",
                                        e.target.value
                                      );
                                    }}
                                    sx={{
                                      color: "#4f46e5", // Custom color
                                    }}
                                  />
                                </div>
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>

          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                New Arrivals
              </h1>

              <div className="flex items-center">
                <Menu
                  as="div"
                  className="relative inline-block text-left"
                ></Menu>
                <button
                  type="button"
                  className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <span className="sr-only">Filters</span>
                  <FunnelIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <section aria-labelledby="products-heading" className="pb-24 pt-6">
              <h2 id="products-heading" className="sr-only">
                Products
              </h2>

              <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                {/* Filters */}
                <form className="hidden lg:block">
                  <h3 className="sr-only">Categories</h3>
                  {filters.map((section) => (
                    <Disclosure
                      as="div"
                      key={section.id}
                      className="border-b border-gray-200 py-6"
                    >
                      {({ open }) => (
                        <>
                          <h3 className="-my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                              <span className="font-medium text-gray-900">
                                {section.name}
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <PlusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <div className="space-y-4">
                              {section.options.map((option, optionIdx) => (
                                <div
                                  key={option.value}
                                  className="flex items-center"
                                >
                                  <input
                                    id={`filter-${section.id}-${optionIdx}`}
                                    name={`${section.id}`}
                                    defaultValue={option.value}
                                    type="checkbox"
                                    defaultChecked={option.checked}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    onChange={(e) => {
                                      reflectFilterInURL(
                                        section.id,
                                        e.target.value
                                      );
                                      updateFilterData(e, setFilterData);
                                    }}
                                  />
                                  <label
                                    htmlFor={`filter-${section.id}-${optionIdx}`}
                                    className="ml-3 text-sm text-gray-600"
                                  >
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ))}
                  {/* Price */}
                  <Disclosure
                    as="div"
                    className="border-b border-gray-200 py-6"
                  >
                    {({ open }) => (
                      <>
                        <h3 className="-my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900">
                              {"Price"}
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              ) : (
                                <PlusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-8">
                          <Slider
                            getAriaLabel={() => "Minimum distance"}
                            valueLabelDisplay="on"
                            disableSwap
                            min={100}
                            max={10000}
                            name="price"
                            value={filterData.price}
                            onChange={(e, val, a) => {
                              // setFilterData((prev) => ({
                              //   ...prev,
                              //   price: val,
                              // }));

                              updateFilterData(e, setFilterData);
                              reflectFilterInURL("price", e.target.value);
                            }}
                            sx={{
                              color: "#4f46e5", // Custom color
                            }}
                          />
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                  {/* Discount */}
                  <Disclosure
                    as="div"
                    className="border-b border-gray-200 py-6"
                  >
                    {({ open }) => (
                      <>
                        <h3 className="-my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900">
                              {"Discount"}
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              ) : (
                                <PlusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-8">
                          <Slider
                            getAriaLabel={() => "Minimum distance"}
                            valueLabelDisplay="on"
                            disableSwap
                            step={10}
                            min={0}
                            max={90}
                            name="discount"
                            value={filterData.discount}
                            onChange={(e, val, a) => {
                              // setFilterData((prev) => ({
                              //   ...prev,
                              //   discount: val,
                              // }));
                              updateFilterData(e, setFilterData);
                              reflectFilterInURL("discount", e.target.value);
                            }}
                            sx={{
                              color: "#4f46e5", // Custom color
                            }}
                          />
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                </form>

                {/* Product grid */}
                <div className="lg:col-span-3">
                  <div className="flex flex-wrap gap-x-3 gap-y-4">
                    {products.length != 0 ? (
                      products.map((product, ind) => (
                        <ProductCard
                          key={ind}
                          productID={product._id}
                          imagePath={product.imageURL}
                          productName={oneSentence(product.title)}
                          productDescription={oneSentence(product.brand)}
                          originalPrice={convertToNumber(product.price)}
                          rateOfDiscount={convertToNumber(
                            product.discount || product.discountPresent || 0
                          )}
                        />
                      ))
                    ) : (
                      <div className="w-full p-20 flex justify-center">
                        <CircularProgress />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
