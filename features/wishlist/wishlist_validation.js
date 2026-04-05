import Joi from "joi";

const wishlistSchema = Joi.object({
    productId: Joi.string().required().messages({
        "string.empty": "productId is required"
    })
});

export { wishlistSchema };
