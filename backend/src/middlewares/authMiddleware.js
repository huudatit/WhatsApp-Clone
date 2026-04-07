import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Session from '../models/Session.js'
import { response } from '../utils/responseHandler.js';

// authorization - xác minh user là ai
export const protectedRoute = (req, res, next) => {
  try {
    // lấy token từ header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
      return response(res, 401, "Không tìm thấy access token!");
    }

    // xác nhận token hợp lệ
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedUser) => {
      if (err) {
        console.error(err);
        return response(res, 403, "Access token hết hạn hoặc không đúng!");
      }

      // tìm user
      const user = await User.findById(decodedUser.userId);

      if (!user) {
        return response(res, 404, "Người dùng không tồn tại!");
      }

      // trả user về trong req
      req.user = user;
      next();
    });

  } catch (error) {
    console.error("Lỗi khi xác minh JWT trong authMiddleware", error);
    return response(res, 500, "Lỗi hệ thống");
  }
}