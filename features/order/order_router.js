import express from "express";
import {placeOrder, readMyOrders, readGuestOrders, readOrder, readAllOrders, changeOrderStatus, cancelOrder} from "./order_controller.js";
import { validation, verifyToken, verifyTokenOptional, verifyAdmin } from "./order_middleware.js";
import { placeOrderSchema, updateOrderStatusSchema } from "./order_validation.js";

const orderRouter = express.Router();

orderRouter.get("/orders/guest", readGuestOrders);
orderRouter.post("/orders", verifyTokenOptional, validation(placeOrderSchema), placeOrder);

orderRouter.get("/orders/my", verifyToken, readMyOrders);
orderRouter.get("/orders/:id", verifyToken, readOrder);
orderRouter.patch("/orders/:id/cancel", verifyToken, cancelOrder);

// Admin only
orderRouter.get("/orders",                  verifyToken, verifyAdmin, readAllOrders);
orderRouter.patch("/orders/:id/status",     verifyToken, verifyAdmin, validation(updateOrderStatusSchema), changeOrderStatus);

export default orderRouter;