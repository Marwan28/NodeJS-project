import express from "express";
import { readCart, addToCart, updateItem, removeItem, emptyCart } from "./cart_controller.js";
import { validation, verifyTokenOptional } from "./cart_middleware.js";
import { addToCartSchema, updateCartItemSchema } from "./cart_validation.js";

const cartRouter = express.Router();

cartRouter.get("/cart", verifyTokenOptional, readCart);
cartRouter.post("/cart", verifyTokenOptional, validation(addToCartSchema), addToCart);
cartRouter.put("/cart/:productId", verifyTokenOptional, validation(updateCartItemSchema), updateItem);
cartRouter.delete("/cart/:productId", verifyTokenOptional, removeItem);
cartRouter.delete("/cart", verifyTokenOptional, emptyCart);

export default cartRouter;