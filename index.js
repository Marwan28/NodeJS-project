// Load environment variables FIRST
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import userRouter from "./features/users/user_router.js";
import profileRouter from "./features/profile/profile_router.js";
import wishlistRouter from "./features/wishlist/wishlist_router.js";
import reviewRouter from "./features/reviews/review_router.js";

let app = express();
app.use(express.json());

app.use(userRouter);
app.use(profileRouter);
app.use(wishlistRouter);
app.use(reviewRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
