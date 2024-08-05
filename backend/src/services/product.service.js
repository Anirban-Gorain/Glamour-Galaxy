const { set } = require("mongoose");
const Category = require("../models/category.model");
const Product = require("../models/product.model");

async function createProduct(productDetails) {
  let topLevelCategory = await Category.findOne({
    name: productDetails.topLevelCategory,
  });

  if (!topLevelCategory) {
    topLevelCategory = new Category({
      name: productDetails.topLevelCategory,
      level: 1,
    });

    topLevelCategory = await topLevelCategory.save();
  }

  let secondLevelCategory = await Category.findOne({
    name: productDetails.secondLevelCategory,
    parentCategory: topLevelCategory._id,
  });

  if (!secondLevelCategory) {
    secondLevelCategory = new Category({
      name: productDetails.secondLevelCategory,
      parentCategory: topLevelCategory._id,
      level: 2,
    });

    secondLevelCategory = await secondLevelCategory.save();
  }

  let thirdLevelCategory = await Category.findOne({
    name: productDetails.thirdLevelCategory,
    parentCategory: secondLevelCategory._id,
  });

  if (!thirdLevelCategory) {
    thirdLevelCategory = new Category({
      name: productDetails.thirdLevelCategory,
      parentCategory: secondLevelCategory._id,
      level: 3,
    });

    thirdLevelCategory = await thirdLevelCategory.save();
  }

  const product = new Product({
    title: productDetails.title,
    description: productDetails.description,
    price: productDetails.price,
    discountedPrice: productDetails.discountedPrice,
    discountPresent: productDetails.discountPresent,
    quantity: productDetails.quantity,
    brand: productDetails.brand,
    color: productDetails.color,
    sizes: productDetails.sizes,
    imageURL: productDetails.imageURL,
    category: thirdLevelCategory._id,
    topLevelCategory: topLevelCategory.name,
    secondLevelCategory: secondLevelCategory.name,
    thirdLevelCategory: thirdLevelCategory.name,
  });

  return await product.save();
}

async function deleteProduct(productId) {
  const deletedProduct = await Product.findByIdAndDelete(productId);
  return deletedProduct;
}

async function updateProduct(productId, newProductDetails) {
  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    newProductDetails
  );
  return updatedProduct;
}

async function getAllProduct(reqQuery) {
  let {
    // category,
    color,
    sizes,
    minPrice,
    maxPrice,
    minDiscount,
    maxDiscount,
    stock,
    pageNo,
    pageSize,
    sort,
    thirdLevelCategory,
  } = reqQuery;

  pageSize = pageSize || 10;
  pageNo = pageNo || 1;

  let query = Product.find().populate("category");

  // if (category) {
  //   const existCategory = await Category.findOne({ name: category });

  //   if (existCategory) {
  //     query = query.where("category").equals(existCategory._id);
  //   } else {
  //     return { content: [], currentPage: 0, totalPage: 0 };
  //   }
  // }

  if (color) {
    const colorSet = new Set(
      color.split(",").map((color) => color.trim().toLowerCase())
    );

    const colorRegex =
      colorSet.size > 0 ? new RegExp([...colorSet].join("|"), "i") : null;

    query = query.where("color").regex(colorRegex);
  }

  if (sizes) {
    const sizesSet = new Set(sizes);
    query = query.where("sizes.name").in([...sizesSet]);
  }

  if (minPrice && maxPrice) {
    query = query.where("discountedPrice").gte(minPrice).lte(maxPrice);
  }

  if (minDiscount && maxDiscount) {
    query = query.where("discountPresent").gte(minDiscount).lte(maxDiscount);
  }

  if (stock) {
    if (stock == "in_stock") {
      query = query.where("quantity").gt(1);
    } else if (stock == "out_of_stock") {
      query = query.where("quantity").lt(1);
    }
  }

  if (sort) {
    const sortDirection = sort === "price_high_to_low" ? 1 : -1;
    query = query.sort({ discountedPrice: sortDirection });
  }

  if (thirdLevelCategory) {
    query = query.where("thirdLevelCategory").equals(thirdLevelCategory);
  }

  const totalProducts = await Product.countDocuments(query);
  const skip = (pageNo - 1) * pageSize;
  query = query.skip(skip).limit(pageSize);
  const products = await query.exec();
  const totalPages = Math.ceil(totalProducts / pageSize);

  return {
    content: products,
    currentPage: pageNo,
    totalPages,
    totalResults: products.length,
  };
}

async function createMultipleProduct(products) {
  for (let product of products) {
    await createProduct(product);
  }
}

async function findProductById(productId) {
  const product = await Product.findById(productId)
    .populate({
      path: "ratings",
      populate: { path: "user" },
    })
    .populate({
      path: "reviews",
      populate: { path: "user" },
    });

  return product;
}

module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getAllProduct,
  createProduct,
  createMultipleProduct,
  findProductById,
};
