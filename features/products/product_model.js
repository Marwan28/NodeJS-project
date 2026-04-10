import db from "../../config/firebase-config.js";

let collection = db.collection("products");

export const getProducts = async ({
  name,
  categoryId,
  minPrice,
  maxPrice,
} = {}) => {
  let query = collection;
  if (categoryId) {
    query = query.where("categoryId", "==", categoryId);
  }
  if (minPrice) {
    query = query.where("price", ">=", Number(minPrice));
  }
  if (maxPrice) {
    query = query.where("price", "<=", Number(maxPrice));
  }
  const snapshot = await query.get();
  let products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  if (name) {
    products = products.filter((p) =>
      p.name.toLowerCase().includes(name.toLowerCase()),
    );
  }
  return products;
};

export const getProductById = async (id) => {
  const doc = await collection.doc(id).get();
  if (!doc.exists) return null;

  return { id: doc.id, ...doc.data() };
};

export const countProductsByCategoryId = async (categoryId) => {
  const snapshot = await collection
    .where("categoryId", "==", categoryId)
    .get();

  return snapshot.size;
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
