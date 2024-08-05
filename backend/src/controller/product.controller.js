const productServices = require("../services/product.service.js");

async function createProduct(req, res) {
  const productDetails = req.body;
  try {
    const createdProduct = await productServices.createProduct(productDetails);

    res.status(200).send({ content: createdProduct, message: "success" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

async function deleteProduct(req, res) {
  const productId = req.params.productId;

  try {
    const deletedProduct = await productServices.deleteProduct(productId);

    res.status(410).send({ content: deletedProduct, message: "success" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

async function updateProduct(req, res) {
  const productId = req.params.productId;
  try {
    const updatedProduct = await productServices.updateProduct(
      productId,
      req.body
    );

    res.status(200).send({ content: updatedProduct, message: "success" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

async function getAllProduct(req, res) {
  try {
    const products = await productServices.getAllProduct(req.body);

    res.status(200).send({ content: products, message: "success" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

async function createMultipleProduct(req, res) {
  try {
    const createdProducts = await productServices.createMultipleProduct(
      req.body
    );

    res.status(201).send({ content: createdProducts, message: "success" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

async function findProductById(req, res) {
  const productId = req.params.productId;
  try {
    const product = await productServices.findProductById(productId);

    res.status(200).send({ content: product, message: "success" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getAllProduct,
  createMultipleProduct,
  findProductById,
};
