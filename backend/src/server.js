import dotenv from "dotenv";
import express from "express";
import cookieParse from "cookie-parser";
import { connectDB } from "./libs/db.js";
import authRoute from './routes/authRoute.js';
import { protectedRoute } from "./middlewares/authMiddleware.js";
import userRoute from "./routes/userRoute.js";
import friendRoute from "./routes/friendRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// middlewares
app.use(express.json());
app.use(cookieParse());

// public route
app.use('/api/auth', authRoute);

//private routes
app.use(protectedRoute);
app.use('/api/users', userRoute);
app.use('/api/friends', friendRoute);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server bắt đầu trên cổng ${PORT}`);
  });
});
