import db from "../../config/firebase-config.js";

// GET reviews by product ID
export const getReviewsByProductId = async (productId) => {
    const snapshot = await db.collection("reviews")
        .where("productId", "==", productId)
        .orderBy("createdAt", "desc")
        .get();
    
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

// GET reviews by user ID
export const getReviewsByUserId = async (userId) => {
    const snapshot = await db.collection("reviews")
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .get();
    
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

// GET review by ID
export const getReviewById = async (reviewId) => {
    const doc = await db.collection("reviews").doc(reviewId).get();
    
    if(!doc.exists){
        return null;
    }
    
    return {
        id: doc.id,
        ...doc.data()
    };
};

// CREATE review
export const createReview = async (userId, reviewData) => {
    // Check if user already reviewed this product
    const existing = await db.collection("reviews")
        .where("userId", "==", userId)
        .where("productId", "==", reviewData.productId)
        .limit(1)
        .get();
    
    if(!existing.empty){
        return null; // Already reviewed
    }
    
    const review = {
        userId: userId,
        productId: reviewData.productId,
        rating: reviewData.rating,
        comment: reviewData.comment || "",
        createdAt: Date.now(),
        updatedAt: Date.now()
    };
    
    const doc = await db.collection("reviews").add(review);
    
    return {
        id: doc.id,
        ...review
    };
};

// UPDATE review
export const updateReview = async (reviewId, data) => {
    await db.collection("reviews").doc(reviewId).update({
        rating: data.rating,
        comment: data.comment,
        updatedAt: Date.now()
    });
    
    return await getReviewById(reviewId);
};

// DELETE review
export const deleteReview = async (reviewId) => {
    await db.collection("reviews").doc(reviewId).delete();
};

// GET average rating for product
export const getAverageRating = async (productId) => {
    const reviews = await getReviewsByProductId(productId);
    
    if(reviews.length === 0){
        return { average: 0, count: 0 };
    }
    
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const average = sum / reviews.length;
    
    return {
        average: Math.round(average * 10) / 10,
        count: reviews.length
    };
};
