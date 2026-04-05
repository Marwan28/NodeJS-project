import { getReviewsByProductId, getReviewsByUserId, getReviewById, createReview, updateReview, deleteReview, getAverageRating } from "./review_model.js";
import { getUserById } from "../users/user_model.js";

// GET reviews by product ID
export const readProductReviews = async (req, res) => {
    const productId = req.params.productId;
    const reviews = await getReviewsByProductId(productId);
    
    // Populate with user details
    const reviewsWithUsers = await Promise.all(
        reviews.map(async (review) => {
            const user = await getUserById(review.userId);
            return {
                id: review.id,
                rating: review.rating,
                comment: review.comment,
                createdAt: review.createdAt,
                user: user ? {
                    id: user.id,
                    name: user.name
                } : null
            };
        })
    );
    
    res.json({data: reviewsWithUsers});
};

// GET user reviews
export const readUserReviews = async (req, res) => {
    const userId = req.decoded.id;
    const reviews = await getReviewsByUserId(userId);
    
    res.json({data: reviews});
};

// CREATE review
export const addReview = async (req, res) => {
    const userId = req.decoded.id;
    const review = await createReview(userId, req.body);
    
    if(!review){
        return res.status(400).json({message: "you have already reviewed this product"});
    }
    
    res.status(201).json({message: "review added successfully", data: review});
};

// UPDATE review
export const editReview = async (req, res) => {
    const reviewId = req.params.id;
    const review = await getReviewById(reviewId);
    
    if(!review){
        return res.status(404).json({message: "review not found"});
    }
    
    // Check if user owns this review
    if(review.userId !== req.decoded.id){
        return res.status(403).json({message: "you are not allowed to edit this review"});
    }
    
    const updatedReview = await updateReview(reviewId, req.body);
    res.status(200).json({message: "review updated successfully", data: updatedReview});
};

// DELETE review
export const removeReview = async (req, res) => {
    const reviewId = req.params.id;
    const review = await getReviewById(reviewId);
    
    if(!review){
        return res.status(404).json({message: "review not found"});
    }
    
    // Check if user owns this review or is admin
    if(review.userId !== req.decoded.id && req.decoded.role !== "admin"){
        return res.status(403).json({message: "you are not allowed to delete this review"});
    }
    
    await deleteReview(reviewId);
    res.status(200).json({message: "review deleted successfully"});
};

// GET product average rating
export const readProductRating = async (req, res) => {
    const productId = req.params.productId;
    const rating = await getAverageRating(productId);
    
    res.json({data: rating});
};
