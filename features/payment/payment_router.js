import express from "express";
import { createPayPalPayment } from "./payment_controller.js";
import { verifyTokenOptional } from "./payment_middleware.js";

const paymentRouter = express.Router();

// Create payment for an authenticated cart or a guest cart.
paymentRouter.post("/payment/create", verifyTokenOptional, createPayPalPayment);

export default paymentRouter;
