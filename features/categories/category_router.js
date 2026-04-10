import express from "express";
import {
  readCategories,
  readCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./category_controller.js";
import { verifyAdmin, verifyToken } from "../users/user_middleware.js";

const categoryRouter = express.Router();
categoryRouter.get("/categories", readCategories);
categoryRouter.get("/categories/:id", readCategoryById);
categoryRouter.post("/categories",verifyToken, verifyAdmin, createCategory);
categoryRouter.put("/categories/:id",verifyToken, verifyAdmin, updateCategory);
categoryRouter.delete("/categories/:id",verifyToken, verifyAdmin, deleteCategory);

export default categoryRouter;
