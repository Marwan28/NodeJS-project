import {
  getProducts,
  getProductById,
  addProduct,
  editProduct,
  removeProduct,
} from "./product_model.js";

export const readProducts = async (req, res) => {
  const { name, categoryId, minPrice, maxPrice } = req.body || req.query || {};
  const products = await getProducts({ name, categoryId, minPrice, maxPrice });
  if (products.length === 0) {
    return res.status(404).json({ message: "No products found" });
  }
  return res.status(200).json({ message: "getProducts", products: products });
};

export const readProductById = async (req, res) => {
  const product = await getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  return res.status(200).json({ message: "getProductById", product: product });
};

export const createProduct = async (req, res) => {
  const product = await addProduct(req.body);
  res.status(201).json({ message: "addProduct", product: product });
};

export const updateProduct = async (req, res) => {
  const product = await editProduct(req.params.id, req.body);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  return res.status(200).json({ message: "editProduct", product: product });
};

export const deleteProduct = async (req, res) => {
  const product = await removeProduct(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  return res.status(200).json({ message: "removeProduct", product: product });
};
