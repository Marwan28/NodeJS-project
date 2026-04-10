import jwt from "jsonwebtoken";

// Verify token (optional)
export const verifyTokenOptional = (req, res, next) => {
    const token = req.headers.token;
    if (!token) {
        req.decoded = null;
        return next();
    }
    jwt.verify(token, "iti", (err, decoded) => {
        req.decoded = err ? null : decoded;
        next();
    });
};

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
