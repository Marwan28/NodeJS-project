import express from "express";
import { createPayPalPayment } from "./payment_controller.js";
import { verifyToken } from "./payment_middleware.js";

const paymentRouter = express.Router();

// 🎯 Create payment (Authenticated users only)
paymentRouter.post("/payment/create", verifyToken, createPayPalPayment);

export default paymentRouter;
