const categoryServices = require("../services/category.service.js");

async function getCategoryTree(req, res) {
  try {
    const categoryTree = await categoryServices.getCategoryTree();

    res.status(200).send({ content: categoryTree, msg: "success" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

module.exports = { getCategoryTree };
