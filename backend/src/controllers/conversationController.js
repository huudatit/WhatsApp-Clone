import { response } from "../utils/responseHandler.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { io } from "../socket/index.js";
import { protectedRoute } from "../middlewares/authMiddleware.js";

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
      { path: "participants.userId", select: "displayName username avatarUrl" }, 
      { path: "seenBy", select: "username avatarUrl" },
      { path: "lastMessage.senderId", select: "username avatarUrl" },
    ]);

    // Format lại dữ liệu cho đồng bộ với lúc Get danh sách
    const formattedConversation = {
      ...conversation.toObject(),
      unreadCounts: conversation.unreadCounts || {},
      participants: (conversation.participants || []).map((p) => ({
        _id: p.userId?._id,
        displayName: p.userId?.displayName,
        username: p.userId?.username,
        avatarUrl: p.userId?.avatarUrl ?? null,
        joinedAt: p.joinedAt
      }))
    };

    // 🚀 THÊM ĐOẠN NÀY VÀO: Bắn Socket cho tất cả thành viên (trừ người tạo)
    formattedConversation.participants.forEach((p) => {
      const participantId = p._id?.toString();
      // Kiểm tra ID tồn tại và không phải là ID của người đang bấm tạo nhóm
      if (participantId && participantId !== userId.toString()) {
        io.to(participantId).emit("new-group", formattedConversation);
      }
    });

    // Thêm chữ "Tạo phòng thành công" vào để đẩy cục data về đúng vị trí 
    return response(res, 201, "Tạo phòng thành công", { conversation: formattedConversation });
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
        select: "displayName username avatarUrl",
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
        displayName: p.userId?.displayName,
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

    return response(res, 200, "Lấy danh sách thành công", { conversations: formatted });
    
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

    return response(res, 200, "Lấy tin nhắn thành công", { messages, nextCursor });

  } catch (error) {
    console.error("Lỗi xảy ra khi lấy messages", error);
    return response(res, 500, "Lỗi hệ thống");
  }
};

export const getUserConversationsForSocketIO = async (userId) => {
  try {
    const conversations = await Conversation.find(
      { "participants.userId": userId },
      { _id: 1 },
    );

    return conversations.map((c) => c._id.toString());
  } catch (error) {
    console.error("Lỗi khi fetch conversations: ", error);
    return [];
  }
};

export const markAsSeen = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id.toString();

    const conversation = await Conversation.findById(conversationId).lean();

    if (!conversation) {
      return res.status(404).json({ message: "Conversation không tồn tại" });
    }

    const last = conversation.lastMessage;

    if (!last) {
      return res.status(200).json({ message: "Không có tin nhắn để mark as seen" });
    }

    if (last.senderId.toString() === userId) {
      return res.status(200).json({ message: "Sender không cần mark as seen" });
    }

    const updated = await Conversation.findByIdAndUpdate(
      conversationId,
      {
        $addToSet: { seenBy: userId },
        $set: { [`unreadCounts.${userId}`]: 0 },
      },
      {
        new: true,
      },
    );

    io.to(conversationId).emit("read-message", {
      conversation: updated,
      lastMessage: {
        _id: updated?.lastMessage._id,
        content: updated?.lastMessage.content,
        createdAt: updated?.lastMessage.createdAt,
        sender: {
          _id: updated?.lastMessage.senderId,
        },
      },
    });

    return res.status(200).json({
      message: "Marked as seen",
      seenBy: updated?.sennBy || [],
      myUnreadCount: updated?.unreadCounts[userId] || 0,
    });
  } catch (error) {
    console.error("Lỗi khi mark as seen", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    if (!conversationId || conversationId === "undefined" || conversationId === "null") {
      return response(res, 400, "Không tìm thấy ID đoạn chat hợp lệ để xóa!");
    }

    // 1. Xóa toàn bộ tin nhắn thuộc về đoạn chat này
    await Message.deleteMany({ conversationId });
    
    // 2. Xóa đoạn chat
    await Conversation.findByIdAndDelete(conversationId);

    // 3. Bắn socket
    io.to(conversationId.toString()).emit("delete-conversation", conversationId);

    return response(res, 200, "Đã xóa đoạn chat thành công!");
  } catch (error) {
    console.error("Lỗi khi xóa đoạn chat:", error);
    return response(res, 500, "Lỗi hệ thống");
  }
};

