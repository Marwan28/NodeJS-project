import express from "express";
import {
  readPromoCodes,
  readPromoCodeById,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
} from "./promo_code_controller.js";
import { verifyAdmin, verifyToken } from "../users/user_middleware.js";

const promoCodeRouter = express.Router();
promoCodeRouter.get("/promo-codes", readPromoCodes);
promoCodeRouter.get("/promo-codes/:id", readPromoCodeById);
promoCodeRouter.post("/promo-codes",verifyToken ,verifyAdmin, createPromoCode);
promoCodeRouter.put("/promo-codes/:id", verifyToken, verifyAdmin, updatePromoCode);
promoCodeRouter.delete("/promo-codes/:id", verifyToken, verifyAdmin, deletePromoCode);

export default promoCodeRouter;
