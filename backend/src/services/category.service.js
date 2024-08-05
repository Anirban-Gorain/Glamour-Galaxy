const Category = require("../models/category.model.js");

async function getCategoryTree() {
  try {
    const categoryTree = await Category.find({ level: 3 }).populate({
      path: "parentCategory",
      populate: {
        path: "parentCategory",
        populate: { path: "parentCategory" },
      },
    });

    return categoryTree;
  } catch (error) {
    throw new Error("Error from getCategoryTree service " + error.message);
  }
}

module.exports = { getCategoryTree };
