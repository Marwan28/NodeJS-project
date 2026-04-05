import { log } from "firebase/firestore/pipelines";
import db from "../../config/firebase-config.js";

const collection = db.collection("products");

export const getProducts = async () => {
  const snapshot = await collection.get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getProductById = async (id) => {
  const doc = await collection.doc(id).get();
  if (!doc.exists) return null;

  return { id: doc.id, ...doc.data() };
};

export const addProduct = async (product) => {
  const docRef = await collection.add(product);
  return { id: docRef.id, ...product };
};

export const editProduct = async (id, product) => {
  const docRef = collection.doc(id);
  const doc = await docRef.get();
  if (!doc.exists) {
    return null;
  }
  await docRef.update(product);

  const updatedDoc = await docRef.get();
  return { id: id, ...updatedDoc.data() };
};

export const removeProduct = async (id) => {
  const docRef = collection.doc(id);
  const doc = await docRef.get();
  if (!doc.exists) {
    return null;
  }
  await docRef.delete();
  return { id: id, ...doc.data() };
};
