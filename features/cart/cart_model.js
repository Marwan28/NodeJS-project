import db from "../../config/firebase-config.js";

export const getCartByUserId = async (userId) => {
    const snapshot = await db.collection("carts")
        .where("userId", "==", userId)
        .limit(1)
        .get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
};

export const getCartByGuestId = async (guestId) => {
    const snapshot = await db.collection("carts")
        .where("guestId", "==", guestId)
        .limit(1)
        .get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
};

export const createCart = async ({ userId = null, guestId = null }) => {
    const cartData = {
        userId,
        guestId,
        items: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
    };
    const doc = await db.collection("carts").add(cartData);
    return { id: doc.id, ...cartData };
};

export const addItemToCart = async (cartId, newItem) => {
    const doc = await db.collection("carts").doc(cartId).get();
    const cart = doc.data();
    let items = cart.items || [];
    const existingIndex = items.findIndex(i => i.productId === newItem.productId);
    if (existingIndex !== -1) {
        items[existingIndex].quantity += newItem.quantity;
    } else {
        items.push({
            productId: newItem.productId,
            name: newItem.name,
            price: newItem.price,
            imageUrl: newItem.imageUrl || null,
            quantity: newItem.quantity
        });
    }
    await db.collection("carts").doc(cartId).update({
        items,
        updatedAt: Date.now()
    });
    const updated = await db.collection("carts").doc(cartId).get();
    return { id: cartId, ...updated.data() };
};

export const updateCartItem = async (cartId, productId, quantity) => {
    const doc = await db.collection("carts").doc(cartId).get();
    const cart = doc.data();
    let items = cart.items || [];

    const index = items.findIndex(i => i.productId === productId);
    if (index === -1) return null;
    items[index].quantity = quantity;
    await db.collection("carts").doc(cartId).update({
        items,
        updatedAt: Date.now()
    });
    const updated = await db.collection("carts").doc(cartId).get();
    return { id: cartId, ...updated.data() };
};

export const removeItemFromCart = async (cartId, productId) => {
    const doc = await db.collection("carts").doc(cartId).get();
    const cart = doc.data();
    const items = (cart.items || []).filter(i => i.productId !== productId);

    await db.collection("carts").doc(cartId).update({
        items,
        updatedAt: Date.now()
    });
    const updated = await db.collection("carts").doc(cartId).get();
    return { id: cartId, ...updated.data() };
};

export const clearCart = async (cartId) => {
    await db.collection("carts").doc(cartId).update({
        items: [],
        updatedAt: Date.now()
    });
};

export const deleteCart = async (cartId) => {
    await db.collection("carts").doc(cartId).delete();
};