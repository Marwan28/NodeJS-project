import nodemailer from "nodemailer";

const createTransporter = () => {
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

const statusLabels = {
    pending:    "Pending",
    confirmed:  "Confirmed",
    processing: "Processing",
    delivered:  "Delivered",
    cancelled:  "Cancelled"
};

export const sendOrderConfirmationEmail = async (email, order) => {
    const transporter = createTransporter();
    const itemsHtml = order.items.map(item => `
        <tr>
            <td style="padding:10px 8px; border-bottom:1px solid #eee;">${item.name}</td>
            <td style="padding:10px 8px; border-bottom:1px solid #eee; text-align:center;">${item.quantity}</td>
            <td style="padding:10px 8px; border-bottom:1px solid #eee; text-align:right;">$${item.price}</td>
            <td style="padding:10px 8px; border-bottom:1px solid #eee; text-align:right;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
    `).join("");
    const mailOptions = {
        from: `"E-Commerce App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Order Received - ${order.orderNumber}`,
        html: `
            <div style="font-family:Arial,sans-serif; padding:20px; max-width:620px; margin:0 auto;">
                <h1 style="color:#4CAF50;">Thank you for your order! 🎉</h1>
                <p>We received your order and it's currently being reviewed.</p>
                <div style="background:#f9f9f9; padding:15px; border-radius:6px; margin:20px 0;">
                    <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                    <p><strong>Payment Method:</strong> ${order.paymentMethod === "cash_on_delivery" ? "Cash on Delivery" : "PayPal"}</p>
                    <p><strong>Status:</strong> ${statusLabels[order.status]}</p>
                </div>
                <h3>Items Ordered:</h3>
                <table style="width:100%; border-collapse:collapse;">
                    <thead>
                        <tr style="background:#f0f0f0;">
                            <th style="padding:10px 8px; text-align:left;">Product</th>
                            <th style="padding:10px 8px; text-align:center;">Qty</th>
                            <th style="padding:10px 8px; text-align:right;">Price</th>
                            <th style="padding:10px 8px; text-align:right;">Total</th>
                        </tr>
                    </thead>
                    <tbody>${itemsHtml}</tbody>
                </table>
                <div style="margin-top:20px; text-align:right;">
                    <p>Subtotal: <strong>$${order.summary.subtotal}</strong></p>
                    ${order.summary.discount > 0
                        ? `<p>Discount: <strong style="color:#e53935;">- $${order.summary.discount}</strong></p>`
                        : ""}
                    <p style="font-size:18px;">Total: <strong>$${order.summary.total}</strong></p>
                </div>
                <div style="background:#f9f9f9; padding:15px; border-radius:6px; margin:20px 0;">
                    <h3>Shipping To:</h3>
                    <p>${order.shippingAddress.name}</p>
                    <p>${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.country}</p>
                    <p>${order.shippingAddress.phone}</p>
                </div>
                <hr style="margin:30px 0; border:none; border-top:1px solid #ddd;">
                <p style="color:#999; font-size:11px;">
                    If you have any questions, please contact our support team.
                </p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Order confirmation email sent to:", email);
        return true;
    } catch (error) {
        console.error("Failed to send order confirmation email:", error.message);
        return false;
    }
};

export const sendOrderStatusEmail = async (email, order) => {
    const transporter = createTransporter();
    const statusMessages = {
        confirmed:  "Your order has been confirmed and is being prepared.",
        processing: "Your order is currently being processed.",
        delivered:  "Your order has been delivered. Enjoy your purchase! 🎉",
        cancelled:  "Your order has been cancelled."
    };
    const statusColors = {
        confirmed:  "#4CAF50",
        processing: "#FF9800",
        delivered:  "#2196F3",
        cancelled:  "#e53935"
    };

    const color = statusColors[order.status] || "#333";
    const mailOptions = {
        from: `"E-Commerce App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Order Update - ${order.orderNumber} - ${statusLabels[order.status]}`,
        html: `
            <div style="font-family:Arial,sans-serif; padding:20px; max-width:620px; margin:0 auto;">
                <h1 style="color:${color};">Order Status Update 📬</h1>
                <div style="background:#f9f9f9; padding:15px; border-radius:6px; margin:20px 0;">
                    <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                    <p><strong>New Status:</strong>
                        <span style="color:${color}; font-weight:bold;">${statusLabels[order.status]}</span>
                    </p>
                    <p>${statusMessages[order.status] || ""}</p>
                </div>
                <h3>Status History:</h3>
                <ul style="padding-left:20px;">
                    ${order.statusHistory.map(h => `
                        <li style="margin-bottom:6px;">
                            <strong>${statusLabels[h.status]}</strong>
                            — ${new Date(h.timestamp).toLocaleString()}
                            ${h.note ? `<span style="color:#888;">(${h.note})</span>` : ""}
                        </li>
                    `).join("")}
                </ul>
                <hr style="margin:30px 0; border:none; border-top:1px solid #ddd;">
                <p style="color:#999; font-size:11px;">
                    If you have any questions, please contact our support team.
                </p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Order status email sent to:", email);
        return true;
    } catch (error) {
        console.error("Failed to send order status email:", error.message);
        return false;
    }
};