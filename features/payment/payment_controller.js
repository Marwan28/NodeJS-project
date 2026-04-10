import paypal from "@paypal/checkout-server-sdk";
import paypalClient from "../../config/paypal-config.js";
import { getCartByGuestId, getCartByUserId } from "../cart/cart_model.js";
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

// Create PayPal payment link for either an authenticated cart or a guest cart.
const resolveCheckoutCart = async (req) => {
    let userCart = null;

    if (req.decoded) {
        userCart = await getCartByUserId(req.decoded.id);
        if (userCart?.items?.length) {
            return userCart;
        }
    }

    const guestId = req.headers["x-guest-id"];
    if (guestId) {
        const guestCart = await getCartByGuestId(guestId);
        if (guestCart?.items?.length) {
            return guestCart;
        }
    }

    return userCart;
};

export const createPayPalPayment = async (req, res) => {
    try {
        // 1. Resolve an authenticated cart first, then fall back to guest cart.
        const cart = await resolveCheckoutCart(req);

        if (!cart || cart.items.length === 0) {
            const isAuthenticated = Boolean(req.decoded);
            const guestId = req.headers["x-guest-id"];

            if (isAuthenticated && !guestId) {
                return res.status(400).json({
                    message: "Your cart is empty. If the cart was created as a guest, send the x-guest-id header."
                });
            }

            return res.status(400).json({ message: "Your cart is empty" });
        }

        // 2. Verify stock
        for (const item of cart.items) {
            const product = await getProductById(item.productId);
            if (!product) {
                return res.status(400).json({ message: `${item.name} is no longer available` });
            }
            if ((product.stock ?? 0) < item.quantity) {
                return res.status(400).json({ message: `Only ${product.stock} ${item.name} available` });
            }
        }

        // 3. Calculate total
        const amount = calculateCartTotal(cart.items);

        // 4. Create PayPal order
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

        // 5. Return payment link
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
