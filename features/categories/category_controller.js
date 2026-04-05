import {
  getCategories,
  getCategoryById,
  addCategory,
  editCategory,
  removeCategory,
} from "./category_model.js";
export const readCategories = async (req, res) => {
  const categories = await getCategories();
  if (categories.length === 0) {
    return res.status(404).json({ message: "No categories found" });
  }
  return res
    .status(200)
    .json({ message: "getCategories", categories: categories });
};

export const readCategoryById = async (req, res) => {
  const category = await getCategoryById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }
  return res
    .status(200)
    .json({ message: "getCategoryById", category: category });
};
export const createCategory = async (req, res) => {
  console.log(req.body);
  const category = await addCategory(req.body);
  res.status(201).json({ message: "addCategory", category: category });
};

export const updateCategory = async (req, res) => {
  const category = await editCategory(req.params.id, req.body);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }
  return res.status(200).json({ message: "editCategory", category: category });
};

export const deleteCategory = async (req, res) => {
  const category = await removeCategory(req.params.id);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }
  return res
    .status(200)
    .json({ message: "removeCategory", category: category });
};
