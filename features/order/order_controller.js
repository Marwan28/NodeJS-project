import {getAllOrders, getOrdersByUserId, getOrdersByGuestEmail, getOrderById, createOrder, updateOrderStatus} from "./order_model.js";
import { getCartByUserId, getCartByGuestId, clearCart } from "../cart/cart_model.js";
import { sendOrderConfirmationEmail, sendOrderStatusEmail } from "./order_email.js";
import { getUserById } from "../users/user_model.js";
import { getProductById, editProduct } from "../products/product_model.js";

const resolveEmail = async (order) => {
    if (order.userId) {
        const user = await getUserById(order.userId);
        return user?.email || null;
    }
    return order.guestInfo?.email || null;
};

const calculateSummary = (items) => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = items.reduce((sum, item) => {
        if (item.discount) return sum + (item.price * item.discount / 100) * item.quantity;
        return sum;
    }, 0);
    const total = subtotal - discount;
    return {
        itemsCount: items.reduce((sum, i) => sum + i.quantity, 0),
        subtotal: parseFloat(subtotal.toFixed(2)),
        discount: parseFloat(discount.toFixed(2)),
        total: parseFloat(total.toFixed(2))
    };
};

const reduceStock = async (items) => {
    for (const item of items) {
        const product = await getProductById(item.productId);
        if (product && product.stock !== undefined) {
            await editProduct(item.productId, { stock: Math.max(0, product.stock - item.quantity) });
        }
    }
};

const restoreStock = async (items) => {
    for (const item of items) {
        const product = await getProductById(item.productId);
        if (product && product.stock !== undefined) {
            await editProduct(item.productId, { stock: product.stock + item.quantity });
        }
    }
};

export const placeOrder = async (req, res) => {
    const { paymentMethod, shippingAddress, guestInfo, paypalTransactionId } = req.body;
    const isGuest = !req.decoded;

    if (isGuest && !guestInfo) {
        return res.status(400).json({ message: "guestInfo is required for guest checkout" });
    }
    let cart;
    if (!isGuest) {
        cart = await getCartByUserId(req.decoded.id);
    } else {
        const guestId = req.headers["x-guest-id"];
        if (!guestId) return res.status(400).json({ message: "x-guest-id header is required for guest checkout" });
        cart = await getCartByGuestId(guestId);
    }
    if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "cart is empty" });
    }
    for (const item of cart.items) {
        const product = await getProductById(item.productId);
        if (!product) {
            return res.status(400).json({ message: `product "${item.name}" is no longer available` });
        }
        const availableStock = product.stock ?? 0;
        if (availableStock === 0) {
            return res.status(400).json({ message: `product "${item.name}" is out of stock` });
        }
        if (availableStock < item.quantity) {
            return res.status(400).json({ message: `only ${availableStock} items available for "${item.name}"` });
        }
    }
    let resolvedShippingAddress = { ...shippingAddress };
    if (!isGuest) {
        const user = await getUserById(req.decoded.id);
        resolvedShippingAddress.name = user?.name || "";
    } else {
        resolvedShippingAddress.name = guestInfo.name;
    }

    const summary = calculateSummary(cart.items);
    const order = await createOrder({
        userId: req.decoded?.id || null,
        guestInfo: isGuest ? guestInfo : null,
        items: cart.items,
        shippingAddress: resolvedShippingAddress,
        paymentMethod,
        paypalTransactionId,
        summary
    });
    await reduceStock(cart.items);
    await clearCart(cart.id);
    const email = isGuest ? guestInfo.email : (await getUserById(req.decoded.id))?.email;
    if (email) {
        await sendOrderConfirmationEmail(email, order);
    }
    res.status(201).json({
        message: "order placed successfully",
        data: order
    });
};

export const readMyOrders = async (req, res) => {
    const orders = await getOrdersByUserId(req.decoded.id);
    res.json({ data: orders });
};

export const readGuestOrders = async (req, res) => {
    const { email } = req.query;
    if (!email) {
        return res.status(400).json({ message: "email query param is required" });
    }
    const orders = await getOrdersByGuestEmail(email);
    res.json({ data: orders });
};

export const readOrder = async (req, res) => {
    const order = await getOrderById(req.params.id);
    if (!order) {
        return res.status(404).json({ message: "order not found" });
    }
    const isOwner = order.userId === req.decoded.id;
    const isAdmin = req.decoded.role === "admin";
    if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: "access denied" });
    }
    res.json({ data: order });
};

export const readAllOrders = async (req, res) => {
    const orders = await getAllOrders();
    res.json({ data: orders });
};

export const changeOrderStatus = async (req, res) => {
    const { status } = req.body;
    const orderId = req.params.id;
    const order = await getOrderById(orderId);
    if (!order) {
        return res.status(404).json({ message: "order not found" });
    }
    if (order.status === "delivered" || order.status === "cancelled") {
        return res.status(400).json({ message: `cannot update a ${order.status} order` });
    }
    if (status === "cancelled") {
        await restoreStock(order.items);
    }

    const updatedOrder = await updateOrderStatus(orderId, status);
    const email = await resolveEmail(updatedOrder);
    if (email) {
        await sendOrderStatusEmail(email, updatedOrder);
    }
    res.json({ message: "order status updated", data: updatedOrder });
};

export const cancelOrder = async (req, res) => {
    const orderId = req.params.id;
    const order = await getOrderById(orderId);

    if (!order) {
        return res.status(404).json({ message: "order not found" });
    }
    if (order.userId !== req.decoded.id) {
        return res.status(403).json({ message: "access denied" });
    }
    if (!["pending", "confirmed"].includes(order.status)) {
        return res.status(400).json({ message: `cannot cancel a ${order.status} order` });
    }

    await restoreStock(order.items);
    const updatedOrder = await updateOrderStatus(orderId, "cancelled", "Cancelled by customer");
    const email = (await getUserById(req.decoded.id))?.email;
    if (email) {
        await sendOrderStatusEmail(email, updatedOrder);
    }
    res.json({ message: "order cancelled successfully", data: updatedOrder });
};