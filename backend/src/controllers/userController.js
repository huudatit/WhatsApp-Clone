import { uploadImageFromBuffer } from "../middlewares/uploadMiddleware.js";
import { v2 as cloudinary } from "cloudinary";
import { response } from "../utils/responseHandler.js";
import User from "../models/User.js";

export const updateProfile = async (req, res) => {
  try {
    const { username, agreed, bio } = req.body;

    if (!req.user) return response(res, 401, "Chưa xác thực!");

    const userId = req.user._id;
    const file = req.file;

    const user = await User.findById(userId);
    if (!user) return response(res, 404, "Không tìm thấy User!");

    if (file) {
      if (user.avatarId) await cloudinary.uploader.destroy(user.avatarId);

      const result = await uploadImageFromBuffer(file.buffer);

      user.avatarUrl = result.secure_url;
      user.avatarId = result.public_id;
    }

    if (username) user.username = username;
    if (agreed !== undefined) user.agreed = agreed;
    if (bio) user.bio = bio;

    await user.save();
  
    return response(res, 200, "Cập nhật thông tin User thành công", {
      username: user.username,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      agreed: user.agreed,
    });
  } catch (error) {
    console.error("Lỗi xảy ra khi upload avatar", error);
    return response(res, 500, "Upload failed");
  }
};

export const searchUserByUsername = async (req, res) => {
  try {
    const { username } = req.query;

    console.log("=== BẮT ĐẦU TÌM KIẾM BẠN BÈ ===");
    console.log("1. Từ khóa gõ vào:", username);

    if (!username || username.trim() === "") {
      return res.status(400).json({ message: "Cần cung cấp username trong query." });
    }

    // TÌM THEO USERNAME HOẶC ĐUÔI EMAIL
    const user = await User.findOne({
      $or: [
        { username: username },
        { email: new RegExp(`^${username}@`, "i") } 
      ]
    }).select("_id displayName username email avatarUrl");

    console.log("2. Kết quả DB tìm được:", user);

    if (!user) {
      return res.status(200).json({ user: null });
    }

    // Đắp thêm thông tin nếu DB bị trống
    const formattedUser = {
      ...user.toObject(),
      username: user.username || user.email.split('@')[0],
      displayName: user.displayName || user.email.split('@')[0],
    };

    return res.status(200).json({ user: formattedUser });
  } catch (error) {
    console.error("Lỗi xảy ra khi searchUserByUsername", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};