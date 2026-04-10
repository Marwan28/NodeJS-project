import paypal from "@paypal/checkout-server-sdk";
import paypalClient from "../../config/paypal-config.js";
import { getCartByUserId } from "../cart/cart_model.js";
import { getProductById } from "../products/product_model.js";

// Helper: Calculate cart total
const calculateCartTotal = (items) => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = items.reduce((sum, item) => {
        if (item.discount) {
            return sum + (item.price * item.discount / 100) * item.quantity;
        }
        return sum;
    }, 0);
    return parseFloat((subtotal - discount).toFixed(2));
};

// 🎯 Create PayPal Payment Link (Authenticated Users Only)
export const createPayPalPayment = async (req, res) => {
    try {
        // 1. Check authentication
        if (!req.decoded) {
            return res.status(401).json({ message: "Please login to checkout" });
        }

        // 2. Get user's cart from database
        const cart = await getCartByUserId(req.decoded.id);

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Your cart is empty" });
        }

        // 3. Verify stock
        for (const item of cart.items) {
            const product = await getProductById(item.productId);
            if (!product) {
                return res.status(400).json({ message: `${item.name} is no longer available` });
            }
            if ((product.stock ?? 0) < item.quantity) {
                return res.status(400).json({ message: `Only ${product.stock} ${item.name} available` });
            }
        }

        // 4. Calculate total
        const amount = calculateCartTotal(cart.items);

        // 5. Create PayPal order
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: "CAPTURE",
            purchase_units: [{
                amount: {
                    currency_code: "USD",
                    value: amount.toFixed(2)
                }
            }],
            application_context: {
                return_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/payment/success`,
                cancel_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/payment/cancel`,
                brand_name: "E-Commerce App",
                user_action: "PAY_NOW"
            }
        });

        const order = await paypalClient().execute(request);
        const approvalUrl = order.result.links.find(link => link.rel === "approve").href;

        // 6. Return payment link
        res.json({
            success: true,
            paymentUrl: approvalUrl,
            amount: amount,
            orderId: order.result.id
        });

    } catch (error) {
        console.error("PayPal Error:", error);
        res.status(500).json({ message: "Payment creation failed", error: error.message });
    }
};
