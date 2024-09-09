import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

const app = express();

app.use(cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import wishRouter from "./routes/wishlistRoutes.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v2/product", productRouter);
app.use("/api/v3/wishlist", wishRouter);

const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => app.listen(port))
  .then(() =>
    console.log(`⚙️  Server is running and connected to db at port ${port} :)`)
  )
  .catch((err) => console.log(`Error: ${err}`));


  
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

export default app;
// done with some changes done more and more
