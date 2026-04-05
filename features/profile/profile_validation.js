import Joi from "joi";

const profileSchema = Joi.object({
    address: Joi.string().min(5).max(200).optional(),
    city: Joi.string().min(2).max(100).optional(),
    state: Joi.string().min(2).max(100).optional(),
    zipCode: Joi.string().min(3).max(20).optional(),
    country: Joi.string().min(2).max(100).optional(),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional()
});

const paymentMethodSchema = Joi.object({
    type: Joi.string().valid('credit_card', 'debit_card', 'paypal', 'bank_transfer').required(),
    cardNumber: Joi.string().when('type', {
        is: Joi.valid('credit_card', 'debit_card'),
        then: Joi.string().pattern(/^[0-9]{16}$/).required(),
        otherwise: Joi.optional()
    }),
    cardHolderName: Joi.string().when('type', {
        is: Joi.valid('credit_card', 'debit_card'),
        then: Joi.string().min(3).max(100).required(),
        otherwise: Joi.optional()
    }),
    expiryDate: Joi.string().when('type', {
        is: Joi.valid('credit_card', 'debit_card'),
        then: Joi.string().pattern(/^(0[1-9]|1[0-2])\/[0-9]{2}$/).required(),
        otherwise: Joi.optional()
    }),
    cvv: Joi.string().when('type', {
        is: Joi.valid('credit_card', 'debit_card'),
        then: Joi.string().pattern(/^[0-9]{3,4}$/).required(),
        otherwise: Joi.optional()
    }),
    email: Joi.string().email().when('type', {
        is: 'paypal',
        then: Joi.required(),
        otherwise: Joi.optional()
    }),
    accountNumber: Joi.string().when('type', {
        is: 'bank_transfer',
        then: Joi.string().min(8).max(20).required(),
        otherwise: Joi.optional()
    }),
    bankName: Joi.string().when('type', {
        is: 'bank_transfer',
        then: Joi.string().min(2).max(100).required(),
        otherwise: Joi.optional()
    })
});

export { profileSchema, paymentMethodSchema };
