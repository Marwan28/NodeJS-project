// Load environment variables FIRST
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import userRouter from "./features/users/user_router.js";
import profileRouter from "./features/profile/profile_router.js";
import wishlistRouter from "./features/wishlist/wishlist_router.js";
import reviewRouter from "./features/reviews/review_router.js";
import productRouter from "./features/products/product_router.js";
import categoryRouter from "./features/categories/category_router.js";
import cartRouter from "./features/cart/cart_router.js";
import promoCodeRouter from "./features/promo_codes/promo_codes_router.js";
import orderRouter from "./features/order/order_router.js";

let app = express();

app.use(express.json());

app.use(userRouter);
app.use(profileRouter);
app.use(wishlistRouter);
app.use(reviewRouter);
app.use(productRouter);
app.use(categoryRouter);
app.use(cartRouter);
app.use(promoCodeRouter);
app.use(orderRouter);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
