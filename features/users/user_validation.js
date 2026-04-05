import Joi from "joi";

const userSchema = Joi.object({
    name: Joi.string().required().min(3).max(50).messages({
        "string.empty": "name is required",
        "string.min": "name must be at least 3 characters"
    }),
    email: Joi.string().email().messages({
        "string.email": "please provide a valid email"
    }),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).messages({
        "string.pattern.base": "phone must be 10-15 digits"
    }),
    password: Joi.string().required().min(6).max(20).messages({
        "string.empty": "password is required",
        "string.min": "password must be at least 6 characters"
    }),
    age: Joi.number().min(13).max(120).optional(),
    role: Joi.string().valid('customer', 'admin').default('customer')
}).or('email', 'phone').messages({
    "object.missing": "email or phone is required"
});

const loginSchema = Joi.object({
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/),
    password: Joi.string().required().messages({
        "string.empty": "password is required"
    })
}).or('email', 'phone').messages({
    "object.missing": "email or phone is required"
});

export { userSchema, loginSchema };
