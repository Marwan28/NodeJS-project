import express from "express";
import {
  readPromoCodes,
  readPromoCodeById,
  readPromoCodeByCode,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
} from "./promo_code_controller.js";
import { verifyAdmin, verifyToken } from "../users/user_middleware.js";

const promoCodeRouter = express.Router();
promoCodeRouter.get("/promo-codes", verifyToken, verifyAdmin, readPromoCodes);
promoCodeRouter.get("/promo-codes/:id", verifyToken, readPromoCodeById);
promoCodeRouter.get("/promo-codes/code/:code", verifyToken, readPromoCodeByCode);
promoCodeRouter.post("/promo-codes", verifyToken, verifyAdmin, createPromoCode);
promoCodeRouter.put("/promo-codes/:id", verifyToken, verifyAdmin, updatePromoCode);
promoCodeRouter.delete("/promo-codes/:id", verifyToken, verifyAdmin, deletePromoCode);

export default promoCodeRouter;
