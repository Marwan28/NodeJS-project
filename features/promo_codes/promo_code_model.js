import db from "../../config/firebase-config.js";

let collection = db.collection("promo_codes");

export const getPromoCodes = async () => {
  const snapshot = await collection.get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getPromoCodeById = async (id) => {
  const doc = await collection.doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

export const addPromoCode = async (promoCode) => {
  const docRef = await collection.add(promoCode);
  return { id: docRef.id, ...promoCode };
};

export const editPromoCode = async (id, promoCode) => {
  const docRef = collection.doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return null;
  await docRef.update(promoCode);
  const updatedDoc = await docRef.get();
  return { id: id, ...updatedDoc.data() };
};

export const removePromoCode = async (id) => {
  const docRef = collection.doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return null;
  await docRef.delete();
  return { id: id, ...doc.data() };
};

/**
 * Validate a promo code string and return the promo document (or an error message).
 * Does NOT decrement quantity — call decrementPromoCodeQuantity after the order is created.
 */
export const validatePromoCode = async (code) => {
  const snapshot = await collection.where("code", "==", code).limit(1).get();
  if (snapshot.empty) return { error: "Promo code not found" };

  const doc = snapshot.docs[0];
  const promo = { id: doc.id, ...doc.data() };

  // Check expiry
  if (promo.expire_date && new Date(promo.expire_date) < new Date()) {
    return { error: "Promo code has expired" };
  }

  // Check quantity
  if (promo.quantity !== undefined && promo.quantity <= 0) {
    return { error: "Promo code has been fully redeemed" };
  }

  return { promo };
};

/**
 * Decrement the quantity of a promo code by 1 after a successful order.
 */
export const decrementPromoCodeQuantity = async (id) => {
  const docRef = collection.doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return null;
  const current = doc.data().quantity;
  if (current !== undefined) {
    await docRef.update({ quantity: Math.max(0, current - 1) });
  }
};