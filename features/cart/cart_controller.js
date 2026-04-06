import {getCartByUserId, getCartByGuestId, createCart, addItemToCart, updateCartItem, removeItemFromCart, clearCart } from "./cart_model.js";
import { getProductById } from "../products/product_model.js";
import { v4 as uuidv4 } from "uuid";

const calculateSummary = (items) => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = items.reduce((sum, item) => {
        if (item.discount) {
            return sum + (item.price * item.discount / 100) * item.quantity;
        }
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

const resolveCart = async (req) => {
    if (req.decoded) {
        return await getCartByUserId(req.decoded.id);
    } else {
        const guestId = req.headers["x-guest-id"];
        if (!guestId) return null;
        return await getCartByGuestId(guestId);
    }
};

export const readCart = async (req, res) => {
    let cart = await resolveCart(req);

    if (!cart || cart.items.length === 0) {
        return res.status(200).json({ message: "cart is empty", data: { items: [], summary: calculateSummary([]) } });
    }

    res.json({
        data: {
            ...cart,
            summary: calculateSummary(cart.items)
        }
    });
};

export const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    // Verify product exists & has stock
    const product = await getProductById(productId);
    if (!product) {
        return res.status(404).json({ message: "product not found" });
    }
    const availableStock = product.stock ?? 0;
    if (availableStock === 0) {
        return res.status(400).json({ message: "this product is out of stock" });
    }
    if (availableStock < quantity) {
        return res.status(400).json({ message: `only ${availableStock} items available in stock` });
    }

    let cart = await resolveCart(req);

    if (!cart) {
        if (req.decoded) {
            cart = await createCart({ userId: req.decoded.id });
        } else {
            // Guest cart: generate guestId if not provided
            let guestId = req.headers["x-guest-id"] || uuidv4();
            cart = await createCart({ guestId });
            // Send guestId back so frontend can store it
            res.setHeader("x-guest-id", guestId);
        }
    }

    const updatedCart = await addItemToCart(cart.id, {
        productId,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl || null,
        discount: product.discount || 0,
        quantity
    });

    res.status(201).json({
        message: "item added to cart",
        data: {
            ...updatedCart,
            summary: calculateSummary(updatedCart.items)
        }
    });
};

export const updateItem = async (req, res) => {
    const productId = req.params.productId;
    const { quantity } = req.body;

    const cart = await resolveCart(req);
    if (!cart) {
        return res.status(404).json({ message: "cart not found" });
    }

    // Check stock
    const product = await getProductById(productId);
    if (!product) {
        return res.status(404).json({ message: "product not found" });
    }
    const availableStock = product.stock ?? 0;
    if (availableStock === 0) {
        return res.status(400).json({ message: "this product is out of stock" });
    }
    if (availableStock < quantity) {
        return res.status(400).json({ message: `only ${availableStock} items available in stock` });
    }

    const updatedCart = await updateCartItem(cart.id, productId, quantity);
    if (!updatedCart) {
        return res.status(404).json({ message: "item not found in cart" });
    }

    res.json({
        message: "cart updated",
        data: {
            ...updatedCart,
            summary: calculateSummary(updatedCart.items)
        }
    });
};

export const removeItem = async (req, res) => {
    const productId = req.params.productId;
    const cart = await resolveCart(req);
    if (!cart) {
        return res.status(404).json({ message: "cart not found" });
    }
    const itemExists = cart.items.some(i => i.productId === productId);
    if (!itemExists) {
        return res.status(404).json({ message: "product not found in cart" });
    }
    const updatedCart = await removeItemFromCart(cart.id, productId);
    res.json({
        message: "item removed from cart",
        data: {
            ...updatedCart,
            summary: calculateSummary(updatedCart.items)
        }
    });
};

export const emptyCart = async (req, res) => {
    const cart = await resolveCart(req);
    if (!cart) {
        return res.status(404).json({ message: "cart not found" });
    }
    await clearCart(cart.id);
    res.json({ message: "cart cleared" });
};