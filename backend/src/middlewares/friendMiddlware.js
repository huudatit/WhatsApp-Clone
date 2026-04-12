import Conversation from "../models/Conversation.js";
import { response } from "../utils/responseHandler.js";

export const checkGroupMembership = async (req, res, next) => {
  try {
    const { conversationId } = req.body;
    const userId = req.user._id;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) return response(res, 404, "Không tìm thấy cuộc trò chuyện!");

    const isMember = conversation.participants.some((p) =>
      p.userId.toString() === userId.toString()
    );

    if (!isMember) return response(res, 403, "Bạn không ở trong group này!");

    req.conversation = conversation;

    next();

  } catch (error) {
    console.error("Lỗi checkGroupMembership:", error);
    return response(res, 500, "Lỗi hệ thống");
  }
};