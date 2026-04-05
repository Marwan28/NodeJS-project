import express from "express";
import {
  readProducts,
  readProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./product_controller.js";

const productRouter = express.Router();
productRouter.get("/products", readProducts);
productRouter.get("/products/:id", readProductById);
productRouter.post("/products", createProduct);
productRouter.put("/products/:id", updateProduct);
productRouter.delete("/products/:id", deleteProduct);

export default productRouter;
