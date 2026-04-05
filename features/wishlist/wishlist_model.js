import db from "../../config/firebase-config.js";

// GET wishlist by user ID
export const getWishlistByUserId = async (userId) => {
    const snapshot = await db.collection("wishlists")
        .where("userId", "==", userId)
        .get();
    
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

// ADD to wishlist
export const addToWishlist = async (userId, productId) => {
    // Check if already exists
    const existing = await db.collection("wishlists")
        .where("userId", "==", userId)
        .where("productId", "==", productId)
        .limit(1)
        .get();
    
    if(!existing.empty){
        return null; // Already in wishlist
    }
    
    const wishlistData = {
        userId: userId,
        productId: productId,
        createdAt: Date.now()
    };
    
    const doc = await db.collection("wishlists").add(wishlistData);
    
    return {
        id: doc.id,
        ...wishlistData
    };
};

// REMOVE from wishlist
export const removeFromWishlist = async (wishlistId) => {
    await db.collection("wishlists").doc(wishlistId).delete();
};

// REMOVE from wishlist by user and product
export const removeFromWishlistByUserAndProduct = async (userId, productId) => {
    const snapshot = await db.collection("wishlists")
        .where("userId", "==", userId)
        .where("productId", "==", productId)
        .limit(1)
        .get();
    
    if(snapshot.empty){
        return false;
    }
    
    await snapshot.docs[0].ref.delete();
    return true;
};

// CHECK if product in wishlist
export const isInWishlist = async (userId, productId) => {
    const snapshot = await db.collection("wishlists")
        .where("userId", "==", userId)
        .where("productId", "==", productId)
        .limit(1)
        .get();
    
    return !snapshot.empty;
};
