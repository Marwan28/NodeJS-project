import express from "express";
import {
  readCategories,
  readCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./category_controller.js";

const categoryRouter = express.Router();
categoryRouter.get("/categories", readCategories);
categoryRouter.get("/categories/:id", readCategoryById);
categoryRouter.post("/categories", createCategory);
categoryRouter.put("/categories/:id", updateCategory);
categoryRouter.delete("/categories/:id", deleteCategory);

export default categoryRouter;
