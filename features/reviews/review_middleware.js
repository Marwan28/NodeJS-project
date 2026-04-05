import jwt from "jsonwebtoken";

// Validation middleware
export const validation = (schema) => {
    return async (req, res, next) => {
        try {
            const value = await schema.validateAsync(req.body, { abortEarly: false });
            req.body = value;
            next();
        } catch (err) {
            const errors = err.details.map(detail => detail.message);
            res.status(400).json({message: errors.join(", ")});
        }
    };
};

// Verify JWT token
export const verifyToken = (req, res, next) => {
    const token = req.headers.token;
    
    if (!token) {
        return res.status(401).json({message: "token is required"});
    }
    
    jwt.verify(token, "iti", (err, decoded) => {
        if (err) {
            res.status(400).json({message: "invalid token"});
        } else {
            req.decoded = decoded;
            next();
        }
    });
};
