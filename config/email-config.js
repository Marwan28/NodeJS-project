import nodemailer from "nodemailer";

// Function to create transporter (called after dotenv is loaded)
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Send confirmation email
export const sendConfirmationEmail = async (email, token) => {
    const transporter = createTransporter();
    const confirmationUrl = `http://localhost:3000/confirm-email/${token}`;
    
    const mailOptions = {
        from: `"E-Commerce App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Email Confirmation - E-Commerce App",
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #4CAF50;">Welcome! 🎉</h1>
                <p>Thank you for registering with our E-Commerce platform.</p>
                <p>Please confirm your email by clicking the button below:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${confirmationUrl}" 
                       style="background-color: #4CAF50; color: white; padding: 15px 30px; 
                              text-decoration: none; border-radius: 5px; display: inline-block;">
                        Confirm Email
                    </a>
                </div>
                <p>Or copy this link: <a href="${confirmationUrl}">${confirmationUrl}</a></p>
                <p style="color: #666; font-size: 12px;">This link will expire in 24 hours.</p>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
                <p style="color: #999; font-size: 11px;">
                    If you didn't create an account, please ignore this email.
                </p>
            </div>
        `
    };
    
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully to Gmail!");
        console.log("📧 Message ID:", info.messageId);
        console.log("📬 Email sent to:", email);
        return true;
    } catch (error) {
        console.error("❌ Email sending error:", error.message);
        return false;
    }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, token) => {
    const transporter = createTransporter();
    const resetUrl = `http://localhost:3000/reset-password/${token}`;
    
    const mailOptions = {
        from: `"E-Commerce App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Password Reset Request - E-Commerce App",
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #f44336;">Password Reset 🔐</h1>
                <p>You requested to reset your password.</p>
                <p>Click the button below to reset your password:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" 
                       style="background-color: #f44336; color: white; padding: 15px 30px; 
                              text-decoration: none; border-radius: 5px; display: inline-block;">
                        Reset Password
                    </a>
                </div>
                <p>Or copy this link: <a href="${resetUrl}">${resetUrl}</a></p>
                <p style="color: #666; font-size: 12px;">This link will expire in 1 hour.</p>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
                <p style="color: #999; font-size: 11px;">
                    If you didn't request this, please ignore this email. Your password will remain unchanged.
                </p>
            </div>
        `
    };
    
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Password reset email sent to Gmail!");
        console.log("📧 Message ID:", info.messageId);
        console.log("📬 Email sent to:", email);
        return true;
    } catch (error) {
        console.error("❌ Email sending error:", error.message);
        return false;
    }
};

export default createTransporter;
