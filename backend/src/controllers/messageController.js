import { response } from "../utils/responseHandler.js";
import User from "../models/User.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import {
  emitNewMessage,
  updateConversationAfterCreateMessage,
} from "../utils/messageHelper.js";
import { io } from "../socket/index.js";
import {
  uploadImageFromBuffer,
  uploadToCloudinary,
} from "../middlewares/uploadMiddleware.js";

export const sendDirectMessage = async (req, res) => {
  try {
    const { recipientId, content, conversationId } = req.body;
    const senderId = req.user._id;

    let conversation;

    if (!content && !req.file) return response(res, 400, "Thiếu nội dung!");

    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
    }

    if (!conversation && recipientId) {
      conversation = await Conversation.findOne({
        type: "direct",
        "participants.userId": { $all: [senderId, recipientId] },
        participants: { $size: 2 },
      });
    }

    if (!conversation) {
      if (!recipientId)
        return response(
          res,
          400,
          "Thiếu ID người nhận để tạo cuộc trò chuyện mới!",
        );

      conversation = await Conversation.create({
        type: "direct",
        participants: [
          { userId: senderId, joinedAt: new Date() },
          { userId: recipientId, joinedAt: new Date() },
        ],
        lastMessageAt: new Date(),
        unreadCounts: new Map(), 
      });
    }

    let imgUrl = "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imgUrl = result.secure_url;
    }

    const message = await Message.create({
      conversationId: conversation._id,
      senderId,
      content: content || "",
      imgUrl,
    });

    updateConversationAfterCreateMessage(conversation, message, senderId);
    await conversation.save();

    emitNewMessage(io, conversation, message);

    return response(res, 201, "Gửi tin nhắn thành công", { message });
  } catch (error) {
    console.error("Lỗi khi gửi tin nhắn trực tiếp:", error);
    return response(res, 500, "Lỗi hệ thống");
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    let { conversationId, content } = req.body;
    const senderId = req.user._id;

    if (Array.isArray(conversationId)) {
      conversationId = conversationId[0]; // Chỉ lấy phần tử đầu tiên
    }

    let conversation =
      req.conversation || (await Conversation.findById(conversationId));
    if (!conversation) return response(res, 404, "Không tìm thấy nhóm!");
    if (!content && !req.file) return response(res, 400, "Thiếu nội dung!");

    let imgUrl = "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imgUrl = result.secure_url;
    }

    const message = await Message.create({
      conversationId,
      senderId,
      content: content || "",
      imgUrl,
    });

    updateConversationAfterCreateMessage(conversation, message, senderId);
    await conversation.save();

    emitNewMessage(io, conversation, message);

    return response(res, 201, "Gửi tin nhắn nhóm thành công", { message });
  } catch (error) {
    console.error("Lỗi xảy ra khi gửi tin nhắn nhóm:", error);
    return response(res, 500, "Lỗi hệ thống");
  }
};
