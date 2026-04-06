import Joi from "joi";

const addToCartSchema = Joi.object({
    productId: Joi.string().required().messages({
        "string.empty": "productId is required"
    }),
    quantity: Joi.number().integer().min(1).default(1).messages({
        "number.min": "quantity must be at least 1"
    })
});

const updateCartItemSchema = Joi.object({
    quantity: Joi.number().integer().min(1).required().messages({
        "number.min": "quantity must be at least 1",
        "any.required": "quantity is required"
    })
});

const guestCheckoutSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
    address: Joi.string().min(5).max(200).required(),
    city: Joi.string().min(2).max(100).required(),
    country: Joi.string().min(2).max(100).required()
});

export { addToCartSchema, updateCartItemSchema, guestCheckoutSchema };