import dotenv from "dotenv";
import express from "express";
import cookieParse from "cookie-parser";
import { connectDB } from "./libs/db.js";
import authRoute from './routes/authRoute.js';
import { protectedRoute } from "./middlewares/authMiddleware.js";
import userRoute from "./routes/userRoute.js";
import friendRoute from "./routes/friendRoute.js";
import messageRoute from "./routes/messageRoute.js";
import conversationRoute from "./routes/conversationRoute.js";
import cors from "cors";
import {app, server} from "./socket/index.js"

dotenv.config();


const PORT = process.env.PORT || 5001;

// Thêm Middleware CORS TRƯỚC các route
app.use(cors({
  origin: "http://localhost:5173", // Sửa lại đúng port Frontend của em nếu khác
  credentials: true // Bắt buộc phải là true thì mới nhận được Refresh Token qua Cookie
}));

// middlewares
app.use(express.json());
app.use(cookieParse());

// public route
app.use('/api/auth', authRoute);

//private routes
app.use(protectedRoute);
app.use('/api/users', userRoute);
app.use('/api/friends', friendRoute);
app.use('/api/messages', messageRoute);
app.use("/api/conversations", conversationRoute);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server bắt đầu trên cổng ${PORT}`);
  });
});
