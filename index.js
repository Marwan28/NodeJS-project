import express from "express";
import productRouter from "./features/products/product_router.js";
let app = express();
app.use(express.json());
app.use(productRouter);
app.listen(3000, () => {
  console.log("server is running on port 3000");
});
