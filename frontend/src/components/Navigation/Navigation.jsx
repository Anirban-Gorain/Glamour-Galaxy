import { Fragment, useEffect, useState } from "react";
import { Dialog, Popover, Tab, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import logo from "../../assets/mainImages/full_logo.png";
import { Link, useNavigate } from "react-router-dom";
import Popup from "../Popup/Popup";
import LoginForm from "../LoginForm/LoginForm";
import SignUpForm from "../SignUpForm/SignUpForm";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { useSelector, useDispatch } from "react-redux";
import { deleteCookie, getCookieValue } from "../../config/cookies.js";
import { loginJWT, logOut } from "../../redux/features/authSlice.js";
import {
  getCartItems,
  getPrice,
  resetCart,
} from "../../redux/features/cartSlice.js";
import { getNavigationTree } from "../../redux/features/cateSlice.js";
import { replaceAll } from "../../config/string.js";

// const navigation1 = {
//   categories: [
//     {
//       id: "women",
//       name: "Women",
//       featured: [],
//       sections: [
//         {
//           id: "clothing",
//           name: "Clothing",
//           items: [{ name: "Tops", href: "#" }],
//         },
//       ],
//     },
//     {
//       id: "men",
//       name: "Men",
//       featured: [],
//       sections: [
//         {
//           id: "clothing",
//           name: "Clothing",
//           items: [{ name: "Tops", href: "#" }],
//         },
//       ],
//     },
//   ],
//   pages: [],
// };

// const navigation = {
//   categories: [
//     {
//       id: "women",
//       name: "Women",
//       featured: [
//         //   {
//         //     name: "New Arrivals",
//         //     href: "#",
//         //     imageSrc:
//         //       "https://tailwindui.com/img/ecommerce-images/mega-menu-category-01.jpg",
//         //     imageAlt:
//         //       "Models sitting back to back, wearing Basic Tee in black and bone.",
//         //   },
//         //   {
//         //     name: "Basic Tees",
//         //     href: "#",
//         //     imageSrc:
//         //       "https://tailwindui.com/img/ecommerce-images/mega-menu-category-02.jpg",
//         //     imageAlt:
//         //       "Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.",
//         //   },
//       ],
//       sections: [
//         {
//           id: "clothing",
//           name: "Clothing",
//           items: [
//             { name: "Tops", href: "#" },
//             { name: "Dresses", href: "#" },
//             { name: "Pants", href: "#" },
//             { name: "Denim", href: "#" },
//             { name: "Sweaters", href: "#" },
//             { name: "T-Shirts", href: "#" },
//             { name: "Jackets", href: "#" },
//             { name: "Activewear", href: "#" },
//             { name: "Browse All", href: "#" },
//           ],
//         },
//         {
//           id: "accessories",
//           name: "Accessories",
//           items: [
//             { name: "Watches", href: "#" },
//             { name: "Wallets", href: "#" },
//             { name: "Bags", href: "#" },
//             { name: "Sunglasses", href: "#" },
//             { name: "Hats", href: "#" },
//             { name: "Belts", href: "#" },
//           ],
//         },
//         {
//           id: "brands",
//           name: "Brands",
//           items: [
//             { name: "Full Nelson", href: "#" },
//             { name: "My Way", href: "#" },
//             { name: "Re-Arranged", href: "#" },
//             { name: "Counterfeit", href: "#" },
//             { name: "Significant Other", href: "#" },
//           ],
//         },
//       ],
//     },
//     {
//       id: "men",
//       name: "Men",
//       featured: [
//         //   {
//         //     name: "New Arrivals",
//         //     href: "#",
//         //     imageSrc:
//         //       "https://tailwindui.com/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg",
//         //     imageAlt:
//         //       "Drawstring top with elastic loop closure and textured interior padding.",
//         //   },
//         //   {
//         //     name: "Artwork Tees",
//         //     href: "#",
//         //     imageSrc:
//         //       "https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-06.jpg",
//         //     imageAlt:
//         //       "Three shirts in gray, white, and blue arranged on table with same line drawing of hands and shapes overlapping on front of shirt.",
//         //   },
//       ],
//       sections: [
//         {
//           id: "clothing",
//           name: "Clothing",
//           items: [
//             { name: "Tops", href: "#" },
//             { name: "Pants", href: "#" },
//             { name: "Sweaters", href: "#" },
//             { name: "T-Shirts", href: "#" },
//             { name: "Jackets", href: "#" },
//             { name: "Activewear", href: "#" },
//             { name: "Browse All", href: "#" },
//           ],
//         },
//         {
//           id: "accessories",
//           name: "Accessories",
//           items: [
//             { name: "Watches", href: "#" },
//             { name: "Wallets", href: "#" },
//             { name: "Bags", href: "#" },
//             { name: "Sunglasses", href: "#" },
//             { name: "Hats", href: "#" },
//             { name: "Belts", href: "#" },
//           ],
//         },
//         {
//           id: "brands",
//           name: "Brands",
//           items: [
//             { name: "Re-Arranged", href: "#" },
//             { name: "Counterfeit", href: "#" },
//             { name: "Full Nelson", href: "#" },
//             { name: "My Way", href: "#" },
//           ],
//         },
//       ],
//     },
//   ],
//   pages: [
//     // { name: "Company", href: "#" },
//     // { name: "Stores", href: "#" },
//   ],
// };

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [signUpVisible, setSignUpVisible] = useState(true);
  const authStatus = useSelector((state) => state.auth);
  const cartData = useSelector((state) => state.cart);
  const cateData = useSelector((state) => state.cate);
  const noOfCartItems = cartData?.cartItems?.cart?.cartItems?.length;
  const navigation = cateData.navigationTree;
  const JWT = getCookieValue("JWT");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const openUserMenu = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (JWT) {
      dispatch(loginJWT(JWT));
      dispatch(getCartItems());
      dispatch(getPrice());
    }
    dispatch(getNavigationTree());
  }, []);

  useEffect(() => {
    if (authStatus?.isLoggedIn) setOpenModel(false);
  }, [authStatus.isLoggedIn]);

  function logOutHandler() {
    deleteCookie("JWT");
    dispatch(resetCart());
    dispatch(logOut());
  }

  function auth() {
    return !authStatus.isLoggedIn ? (
      <button
        onClick={() => setOpenModel((prev) => !prev)}
        className="text-sm font-medium text-gray-700 hover:text-gray-800"
      >
        Account
      </button>
    ) : (
      <div className="flex gap-x-5 items-center">
        <div>
          <Box
            sx={{ display: "flex", alignItems: "center", textAlign: "center" }}
          >
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={openUserMenu ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openUserMenu ? "true" : undefined}
              >
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    color: "black",
                    border: "2px solid black",
                    fontSize: "15px",
                    fontWeight: "500",
                    backgroundColor: "#fff",
                  }}
                >
                  {authStatus?.user?.user?.fName[0].toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={openUserMenu}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                backgroundColor: "#fff",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 20,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                  backgroundColor: "#fff",
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem
              onClick={() => {
                handleClose();
                navigate("/track-order");
              }}
              sx={{
                color: "black",
              }}
            >
              Track orders
            </MenuItem>
            <Divider sx={{ background: "black" }} />
            <MenuItem
              onClick={() => {
                handleClose();
                logOutHandler();
              }}
              sx={{
                color: "black",
              }}
            >
              Log out
            </MenuItem>
          </Menu>
        </div>
      </div>
    );
  }

  // This following function is responsible for handling, in not authenticated state of user click here cart should not work

  function cartHandler() {
    if (authStatus.isLoggedIn) navigate("/cart");
    else setOpenModel(true);
  }

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
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
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                <div className="flex px-4 pb-2 pt-5">
                  <button
                    type="button"
                    className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                    onClick={() => setOpen(false)}
                  >
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Links */}
                <Tab.Group as="div" className="mt-2">
                  <div className="border-b border-gray-200">
                    <Tab.List className="-mb-px flex space-x-8 px-4">
                      {navigation?.categories.map((category) => (
                        <Tab
                          key={category.name}
                          className={({ selected }) =>
                            classNames(
                              selected
                                ? "border-indigo-600 text-indigo-600"
                                : "border-transparent text-gray-900",
                              "flex-1 whitespace-nowrap border-b-2 px-1 py-4 text-base font-medium"
                            )
                          }
                        >
                          {category.name}
                        </Tab>
                      ))}
                    </Tab.List>
                  </div>
                  <Tab.Panels as={Fragment}>
                    {navigation?.categories.map((category) => {
                      return (
                        <Tab.Panel
                          key={category.name}
                          className="space-y-10 px-4 pb-8 pt-10"
                        >
                          <div className="grid grid-cols-2 gap-x-4">
                            {category.featured.map((item) => (
                              <div
                                key={item.name}
                                className="group relative text-sm"
                              >
                                <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                                  <img
                                    src={item.imageSrc}
                                    alt={item.imageAlt}
                                    className="object-cover object-center"
                                  />
                                </div>
                                <a
                                  href={item.href}
                                  className="mt-6 block font-medium text-gray-900"
                                >
                                  <span
                                    className="absolute inset-0 z-10"
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </a>
                                <p aria-hidden="true" className="mt-1">
                                  Shop now
                                </p>
                              </div>
                            ))}
                          </div>
                          {category.sections.map((section) => (
                            <div key={section.name}>
                              <p
                                id={`${category.id}-${section.id}-heading-mobile`}
                                className="font-medium text-gray-900"
                              >
                                {section.name}
                              </p>
                              <ul
                                role="list"
                                aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                                className="mt-6 flex flex-col space-y-6"
                              >
                                {section.items.map((item) => (
                                  <li key={item.name} className="flow-root">
                                    <Link
                                      to={`${replaceAll(
                                        " ",
                                        "-",
                                        replaceAll("_", "-", item.href)
                                      )}`}
                                      className="-m-2 block p-2 text-gray-500"
                                    >
                                      {item.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </Tab.Panel>
                      );
                    })}
                  </Tab.Panels>
                </Tab.Group>

                <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                  {auth()}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <header className="relative bg-white">
        <nav
          aria-label="Top"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              <button
                type="button"
                className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
                onClick={() => setOpen(true)}
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <Link to="/">
                  <span className="sr-only">Your Company</span>
                  <img className="h-12 w-auto" src={logo} alt="" />
                </Link>
              </div>

              {/* Flyout menus */}
              <Popover.Group className="hidden lg:ml-8 lg:block lg:self-stretch">
                <div className="flex h-full space-x-8">
                  {navigation?.categories.map((category) => (
                    <Popover key={category.name} className="flex">
                      {({ open }) => (
                        <>
                          <div className="relative flex">
                            <Popover.Button
                              className={classNames(
                                open
                                  ? "border-indigo-600 text-indigo-600"
                                  : "border-transparent text-gray-700 hover:text-gray-800",
                                "relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out outline-none"
                              )}
                            >
                              {category.name}
                            </Popover.Button>
                          </div>

                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Popover.Panel className="absolute inset-x-0 top-full text-sm text-gray-500">
                              {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                              {({ close }) => (
                                <>
                                  <div
                                    className="absolute inset-0 top-1/2 bg-white shadow"
                                    aria-hidden="true"
                                  />

                                  <div className="relative bg-white z-10">
                                    <div className="mx-auto max-w-7xl px-8">
                                      <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
                                        <div className="col-start-2 grid grid-cols-2 gap-x-8">
                                          {category.featured.map((item) => (
                                            <div
                                              key={item.name}
                                              className="group relative text-base sm:text-sm"
                                            >
                                              <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                                                <img
                                                  src={item.imageSrc}
                                                  alt={item.imageAlt}
                                                  className="object-cover object-center"
                                                />
                                              </div>
                                              <a
                                                href={item.href}
                                                className="mt-6 block font-medium text-gray-900"
                                              >
                                                <span
                                                  className="absolute inset-0 z-10"
                                                  aria-hidden="true"
                                                />
                                                {item.name}
                                              </a>
                                              <p
                                                aria-hidden="true"
                                                className="mt-1"
                                              >
                                                Shop now
                                              </p>
                                            </div>
                                          ))}
                                        </div>
                                        <div className="row-start-1 grid grid-cols-3 gap-x-8 gap-y-10 text-sm">
                                          {category.sections.map((section) => (
                                            <div key={section.name}>
                                              <p
                                                id={`${section.name}-heading`}
                                                className="font-medium text-gray-900"
                                              >
                                                {section.name}
                                              </p>
                                              <ul
                                                role="list"
                                                aria-labelledby={`${section.name}-heading`}
                                                className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                              >
                                                {section.items.map((item) => (
                                                  <li
                                                    key={item.name}
                                                    className="flex"
                                                  >
                                                    <Link
                                                      onClick={() => close()}
                                                      to={`${replaceAll(
                                                        " ",
                                                        "-",
                                                        replaceAll(
                                                          "_",
                                                          "-",
                                                          item.href
                                                        )
                                                      )}`}
                                                    >
                                                      {item.name}
                                                    </Link>
                                                  </li>
                                                ))}
                                              </ul>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                            </Popover.Panel>
                          </Transition>
                        </>
                      )}
                    </Popover>
                  ))}

                  {navigation?.pages.map((page) => (
                    <a
                      key={page.name}
                      href={page.href}
                      className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                      {page.name}
                    </a>
                  ))}
                </div>
              </Popover.Group>

              <div className="ml-auto flex items-center">
                {/* SignUp, LogIn, Avatar */}
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  {auth()}
                  <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                </div>

                {/* Search */}
                <div className="flex lg:ml-6">
                  <a href="#" className="p-2 text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Search</span>
                    <MagnifyingGlassIcon
                      className="h-6 w-6"
                      aria-hidden="true"
                    />
                  </a>
                </div>

                {/* Cart */}
                <div className="ml-4  lg:ml-6 flex items-center">
                  {/* <Link
                    to="/cart"
                    className="group -m-2 flex items-center p-2"
                  > */}
                  <ShoppingBagIcon
                    className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                    style={{ cursor: "pointer" }}
                    onClick={cartHandler}
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800 mt-1">
                    {noOfCartItems}
                  </span>
                  <span className="sr-only">items in cart, view bag</span>
                  {/* </Link> */}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <Popup
        open={openModel}
        onClose={() => setOpenModel(false)}
        popupStyle={{
          display: "flex",
          justifyContent: "center",
          marginTop: "150px",
        }}
      >
        <div>
          <div className="flex justify-center bg-slate-50 gap-x-3 pt-3">
            {
              <Button
                onClick={() => setSignUpVisible((prev) => !prev)}
                sx={{
                  textTransform: "capitalize",
                  bgcolor: "#463ed6",
                  borderRadius: "80px",
                  padding: "5px 10px",
                  color: "white",
                  "&:hover": {
                    bgcolor: "#463ed6", // Example hover background color
                    color: "white",
                  },
                }}
              >
                {signUpVisible ? "Already signed up" : "Create a new account"}
              </Button>
            }
          </div>

          {!signUpVisible && <LoginForm />}
          {signUpVisible && <SignUpForm />}
        </div>
      </Popup>
    </div>
  );
}
