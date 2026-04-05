import { getUsers, createUser, updateUser, deleteUser, getUserById } from "./user_model.js";
import jwt from "jsonwebtoken";
import { sendConfirmationEmail } from "../../config/email-config.js";

// Register new user
export const register = async (req, res) => {
    const newUser = await createUser(req.body);
    
    // Generate email confirmation token
    if (newUser.email) {
        const confirmToken = jwt.sign(
            { id: newUser.id, email: newUser.email },
            "iti",
            { expiresIn: "24h" }
        );
        
        // Send confirmation email
        const emailSent = await sendConfirmationEmail(newUser.email, confirmToken);
        
        if (!emailSent) {
            console.log("Failed to send confirmation email");
        }
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
        message: "user registered successfully. please check your email to confirm",
        data: userWithoutPassword
    });
};

// Confirm email
export const confirmEmail = async (req, res) => {
    const { token } = req.params;
    
    try {
        const decoded = jwt.verify(token, "iti");
        
        // Update user confirmation status
        const user = await getUserById(decoded.id);
        
        if (!user) {
            return res.status(404).json({message: "user not found"});
        }
        
        if (user.isConfirmed) {
            return res.status(400).json({message: "email already confirmed"});
        }
        
        await updateUser(decoded.id, { isConfirmed: true });
        
        res.json({message: "email confirmed successfully"});
    } catch (error) {
        res.status(400).json({message: "invalid or expired token"});
    }
};

// Login user
export const login = async (req, res) => {
    // Check if email is confirmed
    if (req.founduser.email && !req.founduser.isConfirmed) {
        return res.status(403).json({message: "please confirm your email before logging in"});
    }
    
    const token = jwt.sign(
        {
            id: req.founduser.id,
            email: req.founduser.email,
            phone: req.founduser.phone,
            role: req.founduser.role
        },
        "iti",
        { expiresIn: "24h" }
    );
    
    res.json({
        message: "login successful",
        token,
        user: {
            id: req.founduser.id,
            name: req.founduser.name,
            email: req.founduser.email,
            phone: req.founduser.phone,
            role: req.founduser.role
        }
    });
};

// GET all users (Admin only)
export const readUsers = async (req, res) => {
    const users = await getUsers();
    
    // Remove passwords from response
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    
    res.json({data: usersWithoutPasswords});
};

// GET user by ID
export const readUser = async (req, res) => {
    const id = req.params.id;
    const user = await getUserById(id);
    
    if (!user) {
        return res.status(404).json({message: "user not found"});
    }
    
    // Check if user is accessing their own profile or is admin
    if (user.id !== req.decoded.id && req.decoded.role !== "admin") {
        return res.status(403).json({message: "you are not allowed to view this user"});
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    
    res.json({data: userWithoutPassword});
};

// UPDATE user
export const editUser = async (req, res) => {
    const id = req.params.id;
    
    // Check if user is updating their own profile or is admin
    if (id !== req.decoded.id && req.decoded.role !== "admin") {
        return res.status(403).json({message: "you are not allowed to update this user"});
    }
    
    // Prevent role change unless admin
    if (req.body.role && req.decoded.role !== "admin") {
        delete req.body.role;
    }
    
    const user = await updateUser(id, req.body);
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    
    res.status(200).json({
        message: "user updated successfully",
        data: userWithoutPassword
    });
};

// DELETE user
export const removeUser = async (req, res) => {
    const id = req.params.id;
    
    // Check if user is deleting their own profile or is admin
    if (id !== req.decoded.id && req.decoded.role !== "admin") {
        return res.status(403).json({message: "you are not allowed to delete this user"});
    }
    
    await deleteUser(id);
    res.status(200).json({message: "user deleted successfully"});
};
