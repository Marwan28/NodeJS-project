import { getWishlistByUserId, addToWishlist, removeFromWishlistByUserAndProduct, isInWishlist } from "./wishlist_model.js";

// GET user wishlist
export const readWishlist = async (req, res) => {
    const userId = req.decoded.id;
    const wishlist = await getWishlistByUserId(userId);
    
    res.json({data: wishlist});
};

// ADD to wishlist
export const addToWishlistController = async (req, res) => {
    const userId = req.decoded.id;
    const { productId } = req.body;
    
    const wishlistItem = await addToWishlist(userId, productId);
    
    if(!wishlistItem){
        return res.status(400).json({message: "product already in wishlist"});
    }
    
    res.status(201).json({message: "product added to wishlist", data: wishlistItem});
};

// REMOVE from wishlist
export const removeFromWishlistController = async (req, res) => {
    const userId = req.decoded.id;
    const { productId } = req.params;
    
    const removed = await removeFromWishlistByUserAndProduct(userId, productId);
    
    if(!removed){
        return res.status(404).json({message: "product not in wishlist"});
    }
    
    res.status(200).json({message: "product removed from wishlist"});
};

// CHECK if in wishlist
export const checkWishlist = async (req, res) => {
    const userId = req.decoded.id;
    const { productId } = req.params;
    
    const inWishlist = await isInWishlist(userId, productId);
    
    res.json({inWishlist: inWishlist});
};
