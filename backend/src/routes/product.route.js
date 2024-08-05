const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate.js");
const productController = require("../controller/product.controller.js");

router.post("/create", authenticate, productController.createProduct);
router.delete(
  "/delete/:productId",
  authenticate,
  productController.deleteProduct
);
router.patch(
  "/update/:productId",
  authenticate,
  productController.updateProduct
);
router.post(
  "/get-products-on-query",
  // authenticate,
  productController.getAllProduct
);
router.post(
  "/create-multiple",
  authenticate,
  productController.createMultipleProduct
);
router.get("/get/:productId", productController.findProductById);

module.exports = router;
