import db from "../../config/firebase-config.js";

let collection = db.collection("categories");

export const getCategories = async () => {
  const snapshot = await collection.get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getCategoryById = async (id) => {
  const doc = await collection.doc(id).get();
  if (!doc.exists) return null;

  return { id: doc.id, ...doc.data() };
};

export const addCategory = async (category) => {
  const docRef = await collection.add(category);
  return { id: docRef.id, ...category };
};

export const editCategory = async (id, category) => {
  const docRef = collection.doc(id);
  const doc = await docRef.get();
  if (!doc.exists) {
    return null;
  }
  await docRef.update(category);

  const updatedDoc = await docRef.get();
  return { id: id, ...updatedDoc.data() };
};

export const removeCategory = async (id) => {
  const docRef = collection.doc(id);
  const doc = await docRef.get();
  if (!doc.exists) {
    return null;
  }
  await docRef.delete();
  return { id: id, ...doc.data() };
};
