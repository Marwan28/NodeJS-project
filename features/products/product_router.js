import express from "express";
import {
  readProducts,
  readProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./product_controller.js";
import { verifyAdmin } from "../users/user_middleware.js";

const productRouter = express.Router();
productRouter.get("/products", readProducts);
productRouter.get("/products/:id", readProductById);
productRouter.post("/products",verifyAdmin, createProduct);
productRouter.put("/products/:id",verifyAdmin, updateProduct);
productRouter.delete("/products/:id",verifyAdmin, deleteProduct);

export default productRouter;
