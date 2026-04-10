import express from "express";
import { readProfile, addProfile, editProfile, addPayment, removePayment } from "./profile_controller.js";
import { validation } from "./profile_middleware.js";
import { profileSchema, paymentMethodSchema } from "./profile_validation.js";
import { verifyToken } from "./profile_middleware.js";

const profileRouter = express.Router();

// All routes require authentication
// profileRouter.use(verifyToken);
profileRouter.use("/profile", verifyToken);

profileRouter.get("/profile", readProfile);
profileRouter.post("/profile", validation(profileSchema), addProfile);
profileRouter.put("/profile", validation(profileSchema), editProfile);
profileRouter.post("/profile/payment", validation(paymentMethodSchema), addPayment);
profileRouter.delete("/profile/payment/:paymentId", removePayment);

export default profileRouter;
