import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { getUserByEmail, getUserByPhone } from "./user_model.js";

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

// Verify admin role
export const verifyAdmin = (req, res, next) => {
    if (req.decoded.role !== "admin") {
        return res.status(403).json({message: "access denied. admin only"});
    }
    next();
};

// Check if email or phone exists (for registration)
export const checkEmailOrPhoneExists = async (req, res, next) => {
    const { email, phone } = req.body;
    
    let foundUser = null;
    
    if (email) {
        foundUser = await getUserByEmail(email);
    } else if (phone) {
        foundUser = await getUserByPhone(phone);
    }
    
    if (foundUser) {
        return res.status(400).json({message: "user already exists"});
    }
    
    next();
};

// Check if email or phone exists (for login)
export const checkEmailOrPhoneForLogin = async (req, res, next) => {
    const { email, phone } = req.body;
    
    let foundUser = null;
    
    if (email) {
        foundUser = await getUserByEmail(email);
    } else if (phone) {
        foundUser = await getUserByPhone(phone);
    }
    
    if (!foundUser) {
        return res.status(404).json({message: "user not found"});
    }
    
    req.founduser = foundUser;
    next();
};

// Hash password
export const hashPassword = (req, res, next) => {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    next();
};

// Compare password
export const comparePassword = (req, res, next) => {
    const isMatch = bcrypt.compareSync(req.body.password, req.founduser.password);
    
    if (!isMatch) {
        return res.status(401).json({message: "invalid credentials"});
    }
    
    next();
};
