import db from "../../config/firebase-config.js";

// GET all orders (admin)
export const getAllOrders = async () => {
    const snapshot = await db.collection("orders")
        .orderBy("createdAt", "desc")
        .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// GET orders by userId
export const getOrdersByUserId = async (userId) => {
    const snapshot = await db.collection("orders")
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// GET orders by guestEmail
export const getOrdersByGuestEmail = async (email) => {
    const snapshot = await db.collection("orders")
        .where("guestInfo.email", "==", email)
        .orderBy("createdAt", "desc")
        .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// GET order by ID
export const getOrderById = async (id) => {
    const doc = await db.collection("orders").doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
};

// CREATE order
export const createOrder = async (orderData) => {
    const orderNumber = `ORD-${Date.now()}`;
    const data = {
        orderNumber,
        userId: orderData.userId || null,
        guestInfo: orderData.guestInfo || null,
        items: orderData.items,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        paypalTransactionId: orderData.paypalTransactionId || null,
        status: "pending",
        statusHistory: [
            { status: "pending", timestamp: Date.now(), note: "Order placed" }
        ],
        summary: orderData.summary,
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    const doc = await db.collection("orders").add(data);
    return { id: doc.id, ...data };
};

// UPDATE order status
export const updateOrderStatus = async (orderId, status, note = "") => {
    const doc = await db.collection("orders").doc(orderId).get();
    if (!doc.exists) return null;
    const order = doc.data();
    const statusHistory = order.statusHistory || [];
    statusHistory.push({ status, timestamp: Date.now(), note });
    await db.collection("orders").doc(orderId).update({
        status,
        statusHistory,
        updatedAt: Date.now()
    });
    const updated = await db.collection("orders").doc(orderId).get();
    return { id: orderId, ...updated.data() };
};