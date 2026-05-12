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
import fs from "fs";
import { app, server } from "./socket/index.js";

dotenv.config();

const PORT = process.env.PORT || 5001;

// middlewares
app.use(express.json());
app.use(cookieParse());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

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
