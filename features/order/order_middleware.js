import jwt from "jsonwebtoken";

export const validation = (schema) => {
    return async (req, res, next) => {
        try {
            const value = await schema.validateAsync(req.body, { abortEarly: false });
            req.body = value;
            next();
        } catch (err) {
            const errors = err.details.map(detail => detail.message);
            res.status(400).json({ message: errors.join(", ") });
        }
    };
};

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

export const verifyToken = (req, res, next) => {
    const token = req.headers.token;
    if (!token) {
        return res.status(401).json({ message: "token is required" });
    }
    jwt.verify(token, "iti", (err, decoded) => {
        if (err) {
            res.status(400).json({ message: "invalid token" });
        } else {
            req.decoded = decoded;
            next();
        }
    });
};

export const verifyAdmin = (req, res, next) => {
    if (req.decoded.role !== "admin") {
        return res.status(403).json({ message: "access denied. admin only" });
    }
    next();
};