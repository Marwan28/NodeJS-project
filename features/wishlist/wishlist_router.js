import express from "express";
import { readWishlist, addToWishlistController, removeFromWishlistController, checkWishlist } from "./wishlist_controller.js";
import { validation } from "./wishlist_middleware.js";
import { wishlistSchema } from "./wishlist_validation.js";
import { verifyToken } from "./wishlist_middleware.js";

const wishlistRouter = express.Router();

// All routes require authentication
wishlistRouter.use(verifyToken);

wishlistRouter.get("/wishlist", readWishlist);
wishlistRouter.post("/wishlist", validation(wishlistSchema), addToWishlistController);
wishlistRouter.delete("/wishlist/:productId", removeFromWishlistController);
wishlistRouter.get("/wishlist/check/:productId", checkWishlist);

export default wishlistRouter;
