import express from "express";
import {
  createConversation,
  getConversations,
  getMessages,
  markAsSeen,
  deleteConversation,
} from "../controllers/conversationController.js";
import { protectedRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", createConversation);

router.get("/", getConversations);

router.get("/:conversationId/messages", getMessages);

router.patch("/:conversationId/seen", markAsSeen);

router.delete("/:conversationId", protectedRoute, deleteConversation);

export default router;
