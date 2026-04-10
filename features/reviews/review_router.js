import express from "express";
import { readProductReviews, readUserReviews, addReview, editReview, removeReview, readProductRating } from "./review_controller.js";
import { validation } from "./review_middleware.js";
import { reviewSchema, reviewUpdateSchema } from "./review_validation.js";
import { verifyToken } from "./review_middleware.js";

const reviewRouter = express.Router();

// Public routes
reviewRouter.get("/products/:productId/reviews", readProductReviews);
reviewRouter.get("/products/:productId/rating", readProductRating);

// Protected routes
// reviewRouter.use(verifyToken);
reviewRouter.use("/reviews", verifyToken);
reviewRouter.get("/reviews", readUserReviews);
reviewRouter.post("/reviews", validation(reviewSchema), addReview);
reviewRouter.put("/reviews/:id", validation(reviewUpdateSchema), editReview);
reviewRouter.delete("/reviews/:id", removeReview);

export default reviewRouter;
