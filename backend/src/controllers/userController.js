import { uploadImageFromBuffer } from "../middlewares/uploadMiddleware.js";
import { v2 as cloudinary } from "cloudinary";
import { response } from "../utils/responseHandler.js";
import User from "../models/User.js";

export const authMe = async (req, res) => {
  try {
    const user = req.user; // lấy từ authMiddleware

    if (!user) return response(res, 401, "Chưa xác thực!");

    return response(res, 200, "Lấy thông tin thành công", { user });

  } catch (error) {
    console.error("Lỗi khi gọi authMe", error);
    return response(res, 500, "Lỗi hệ thống");
  }
};

export const searchUserByUsername = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username || username.trim() === "") {
      response(res, 404, "Cần cung cấp username trong query.!");
    }

    const user = await User.findOne({ username }).select(
      "_id username email avatarUrl bio",
    );

    if (!user) return response(res, 404, "Không tìm thấy user!");

    return response(res, 200, "Tìm thấy user thành công", { user });
  } catch (error) {
    console.error("Lỗi xảy ra khi searchUserByUsername", error);
    return response(res, 500, "Lỗi hệ thống");
  }
};

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
  
    return response(res, 200, "Cập nhật thông tin user thành công", {
      username: user.username,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      agreed: user.agreed,
    });
  } catch (error) {
    console.error("Lỗi xảy ra khi updateProfile", error);
    return response(res, 500, "Upload failed");
  }
};