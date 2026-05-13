import express from "express";
import {
  createConversation,
  deleteConversation,
  getConversations,
  getMessages,
  markAsSeen,
} from "../controllers/conversationController.js";

const router = express.Router();

router.post("/", createConversation);

router.get("/", getConversations);

router.get("/:conversationId/messages", getMessages);

router.patch("/:conversationId/seen", markAsSeen);

router.delete("/:conversationId", deleteConversation);

export default router;
