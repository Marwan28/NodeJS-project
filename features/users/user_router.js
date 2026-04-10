import express from "express";
import {
  register,
  login,
  readUsers,
  readUser,
  editUser,
  removeUser,
  confirmEmail,
  updateUserProfileStatus,
} from "./user_controller.js";
import { validation } from "./user_middleware.js";
import { userSchema, loginSchema } from "./user_validation.js";
import {
  checkEmailOrPhoneExists,
  checkEmailOrPhoneForLogin,
} from "./user_middleware.js";
import { hashPassword } from "./user_middleware.js";
import { comparePassword } from "./user_middleware.js";
import { verifyToken, verifyAdmin } from "./user_middleware.js";

const userRouter = express.Router();

// Public routes
userRouter.post(
  "/register",
  validation(userSchema),
  checkEmailOrPhoneExists,
  hashPassword,
  register,
);
userRouter.post(
  "/login",
  validation(loginSchema),
  checkEmailOrPhoneForLogin,
  comparePassword,
  login,
);
userRouter.get("/confirm-email/:token", confirmEmail);

// Protected routes (require authentication)
userRouter.get("/users", verifyToken, verifyAdmin, readUsers);
userRouter.get("/users/:id", verifyToken, readUser);
userRouter.put("/users/:id", verifyToken, editUser);
userRouter.put(
  "/users/:id",
  verifyToken,
  verifyAdmin,
  updateUserProfileStatus,
);
userRouter.delete("/users/:id", verifyToken, removeUser);

export default userRouter;
