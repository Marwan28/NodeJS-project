import Joi from "joi";

const placeOrderSchema = Joi.object({
    paymentMethod: Joi.string()
        .valid("paypal", "cash_on_delivery")
        .required()
        .messages({
            "any.only": "paymentMethod must be paypal or cash_on_delivery",
            "any.required": "paymentMethod is required"
        }),

    shippingAddress: Joi.object({
        name: Joi.string().min(3).max(100).optional(),
        phone: Joi.string().pattern(/^[0-9]{10,15}$/).required().messages({
            "string.pattern.base": "phone must be 10-15 digits",
            "any.required": "phone is required"
        }),
        address: Joi.string().min(5).max(200).required().messages({
            "any.required": "address is required"
        }),
        city: Joi.string().min(2).max(100).required().messages({
            "any.required": "city is required"
        }),
        country: Joi.string().min(2).max(100).required().messages({
            "any.required": "country is required"
        })
    }).required(),

    guestInfo: Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        phone: Joi.string().pattern(/^[0-9]{10,15}$/).required()
    }).optional(),

    paypalTransactionId: Joi.string().when("paymentMethod", {
        is: "paypal",
        then: Joi.required().messages({ "any.required": "paypalTransactionId is required for PayPal payments" }),
        otherwise: Joi.optional()
    }),

    // Optional promo code string sent by the client
    promoCode: Joi.string().trim().uppercase().optional()
});

const updateOrderStatusSchema = Joi.object({
    status: Joi.string()
        .valid("pending", "confirmed", "processing", "delivered", "cancelled")
        .required()
        .messages({
            "any.only": "invalid order status",
            "any.required": "status is required"
        })
});

export { placeOrderSchema, updateOrderStatusSchema };