import jwt from "jsonwebtoken";

// Verify token (required)
export const verifyToken = (req, res, next) => {
    const token = req.headers.token;
    if (!token) {
        return res.status(401).json({ message: "token is required" });
    }
    jwt.verify(token, "iti", (err, decoded) => {
        if (err) {
            return res.status(400).json({ message: "invalid token" });
        }
        req.decoded = decoded;
        next();
    });
};
