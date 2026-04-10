import express from "express";
import {
  readProducts,
  readProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./product_controller.js";
import { verifyAdmin, verifyToken } from "../users/user_middleware.js";

const productRouter = express.Router();
productRouter.get("/products", readProducts);
productRouter.get("/products/:id", readProductById);
productRouter.post("/products", verifyToken, verifyAdmin, createProduct);
productRouter.put("/products/:id", verifyToken, verifyAdmin, updateProduct);
productRouter.delete("/products/:id", verifyToken, verifyAdmin, deleteProduct);

export default productRouter;
