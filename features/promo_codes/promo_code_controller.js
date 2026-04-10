import {
  getPromoCodes,
  getPromoCodeById,
  getPromoCodeByCode,
  addPromoCode,
  editPromoCode,
  removePromoCode,
} from "./promo_code_model.js";

export const readPromoCodes = async (req, res) => {
  const promoCodes = await getPromoCodes();
  if (promoCodes.length === 0) {
    return res.status(404).json({ message: "No promo codes found" });
  }
  return res
    .status(200)
    .json({ message: "getPromoCodes", promoCodes: promoCodes });
};
export const readPromoCodeById = async (req, res) => {
  const promoCode = await getPromoCodeById(req.params.id);
  if (!promoCode) {
    return res.status(404).json({ message: "Promo code not found" });
  }
  return res
    .status(200)
    .json({ message: "getPromoCodeById", promoCode: promoCode });
};
export const readPromoCodeByCode = async (req, res) => {
  const promoCode = await getPromoCodeByCode(req.params.code);
  if (!promoCode) {
    return res.status(404).json({ message: "Promo code not found" });
  }
  return res
    .status(200)
    .json({ message: "getPromoCodeByCode", promoCode: promoCode });
};
export const createPromoCode = async (req, res) => {
  const promoCode = await addPromoCode(req.body);
  res.status(201).json({ message: "addPromoCode", promoCode: promoCode });
};
export const updatePromoCode = async (req, res) => {
  const promoCode = await editPromoCode(req.params.id, req.body);
  if (!promoCode) {
    return res.status(404).json({ message: "Promo code not found" });
  }
  return res
    .status(200)
    .json({ message: "editPromoCode", promoCode: promoCode });
};
export const deletePromoCode = async (req, res) => {
  const promoCode = await removePromoCode(req.params.id);
  if (!promoCode) {
    return res.status(404).json({ message: "Promo code not found" });
  }
  return res
    .status(200)
    .json({ message: "removePromoCode", promoCode: promoCode });
};
