import { response } from "../utils/responseHandler.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

export const createConversation = async (req, res) => {
  try {
    const { type, name, memberIds } = req.body;
    const userId = req.user._id;

    if (
      !type ||
      (type === "group" && !name) ||
      !memberIds ||
      !Array.isArray(memberIds) ||
      memberIds.length === 0
    ) {
      return response(
        res,
        400,
        "Tên nhóm và danh sách thành viên là bắt buộc!",
      );
    }

    let conversation;

    if (type === "direct") {
      const participantId = memberIds[0];

      conversation = await Conversation.findOne({
        type: "direct",
        "participants.userId": { $all: [userId, participantId] },
      });

      if (!conversation) {
        conversation = new Conversation({
          type: "direct",
          participants: [{ userId }, { userId: participantId }],
          lastMessageAt: new Date(),
        });

        await conversation.save();
      }
    }

    if (type === "group") {
      conversation = new Conversation({
        type: "group",
        participants: [{ userId }, ...memberIds.map((id) => ({ userId: id }))],
        group: {
          name,
          createdBy: userId,
        },
        lastMessageAt: new Date(),
      });

      await conversation.save();
    }

    if (!conversation)
      return response(res, 400, "Conversation type không hợp lệ!");

    await conversation.populate([
      { path: "participants.userId", select: "username avataUrl" },
      { path: "seenBy", select: "username avatarUrl" },
      { path: "lastMessage.senderId", select: "username avatarUrl" },
    ]);

    return response(res, 201, { conversation });
  } catch (error) {
    console.error("Lỗi khi tạo conversation", error);
    return response(res, 500, "Lỗi hệ thống");
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const conversation = await Conversation.find({
      "participants.userId": userId,
    })
      .sort({ lastMessageAt: -1, updatedAt: -1 })
      .populate({
        path: "participants.userId",
        select: "username avatarUrl",
      })
      .populate({
        path: "lastMessage.senderId",
        select: "username avatarUrl",
      })
      .populate({
        path: "seenBy",
        select: "username avatarUrl",
      });
    
    const formatted = conversation.map((convo) => {
      const participants = (convo.participants || []).map((p) => ({
        _id: p.userId?._id,
        username: p.userId?.username,
        avatarUrl: p.userId?.avatarUrl ?? null,
        joinedAt: p.joinedAt
      }));

      return {
        ...convo.toObject(),
        unreadCounts: convo.unreadCounts || {},
        participants,
      };
    });

    return response(res, 200, { conversations: formatted });
    
  } catch (error) {
    console.error("Lỗi xảy ra khi lấy conversations", error);
    return response(res, 500, "Lỗi hệ thống");
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit = 50, cursor } = req.query;

    const query = { conversationId };

    if (cursor) query.createdAt = { $lt: new Date(cursor) };

    let messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit) + 1);
    
    let nextCursor = null;

    if (messages.length > Number(limit)) {
      const nextMessage = messages[messages.length - 1];
      nextCursor = nextMessage.createdAt.toISOString();
      messages.pop();
    }

    messages = messages.reverse();

    return response(res, 200, { messages, nextCursor });

  } catch (error) {
    console.error("Lỗi xảy ra khi lấy messages", error);
    return response(res, 500, "Lỗi hệ thống");
  }
};
