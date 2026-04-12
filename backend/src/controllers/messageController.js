import { response } from "../utils/responseHandler.js";
import User from "../models/User.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { updateConversationAfterCreateMessage } from "../utils/messageHelper.js";

export const sendDirectMessage = async (req, res) => { 
  try {
    const { recipientId, content, conversationId } = req.body;
    const senderId = req.user._id;

    let conversation;

    if (!content) return response(res, 400, "Thiếu nội dung!");
    if (conversationId) conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      conversation = await Conversation.create({
        type: "direct",
        participants: [
          { userId: senderId, joinedAt: new Date() },
          { userId: recipientId, joinedAt: new Date() }
        ],
        lastMessageAt: new Date(),
        unreadCounts: new Map()
      });
    }

    const message = await Message.create({
      conversationId: conversation._id,
      senderId,
      content
    });

    updateConversationAfterCreateMessage(conversation, message, senderId);

    await conversation.save();

    return response(res, 201, { message });

  } catch (error) {
    console.error("Lỗi khi gửi tin nhắn trực tiếp", error);
    return response(res, 500, "Lỗi hệ thống");
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;
    const senderId = req.user._id;
    const conversation = req.conversation;

    if (!content) return response(res, 400, "Thiếu nội dung!");

    const message = await Message.create({
      conversationId,
      senderId,
      content
    });

    updateConversationAfterCreateMessage(conversation, message, senderId);

    await conversation.save();

    return response(res, 201, { message });

  } catch (error) {
    console.error("Lối xảy ra khi gửi tin nhắn nhóm", error);
    return response(res, 500, "Lỗi hệ thống");
  }
};