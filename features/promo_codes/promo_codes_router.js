import express from "express";
import {
  readPromoCodes,
  readPromoCodeById,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
} from "./promo_code_controller.js";

const promoCodeRouter = express.Router();
promoCodeRouter.get("/promo-codes", readPromoCodes);
promoCodeRouter.get("/promo-codes/:id", readPromoCodeById);
promoCodeRouter.post("/promo-codes", createPromoCode);
promoCodeRouter.put("/promo-codes/:id", updatePromoCode);
promoCodeRouter.delete("/promo-codes/:id", deletePromoCode);

export default promoCodeRouter;
