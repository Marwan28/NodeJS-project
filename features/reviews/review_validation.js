import Joi from "joi";

const reviewSchema = Joi.object({
    productId: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required().messages({
        "number.min": "rating must be between 1 and 5",
        "number.max": "rating must be between 1 and 5"
    }),
    comment: Joi.string().min(10).max(500).optional().messages({
        "string.min": "comment must be at least 10 characters"
    })
});

const reviewUpdateSchema = Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().min(10).max(500).optional()
});

export { reviewSchema, reviewUpdateSchema };
