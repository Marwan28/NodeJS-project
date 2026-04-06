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
  if (!doc.exists) {
    return null;
  }
  await docRef.update(promoCode);

  const updatedDoc = await docRef.get();
  return { id: id, ...updatedDoc.data() };
};

export const removePromoCode = async (id) => {
  const docRef = collection.doc(id);
  const doc = await docRef.get();
  if (!doc.exists) {
    return null;
  }
  await docRef.delete();
  return { id: id, ...doc.data() };
};
