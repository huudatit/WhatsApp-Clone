import User from "../models/User.js";
import Session from "../models/Session.js";
import { otpGenerate } from "../utils/otpGenerator.js";
import { response } from "../utils/responseHandler.js";
import { sendOtpToEmail } from "../services/emailService.js";
import {
  sendOtpToPhoneNumber,
  verifyOtp as twilioVerifyOtp,
} from "../services/twilioService.js";
import jwt from 'jsonwebtoken';
import crypto from "crypto";

const ACCESS_TOKEN_TTL = "30m"; // thuờng là dưới 15m
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 ngày

// Gửi OTP
export const sendOtp = async (req, res) => {
  try {
    const { phoneNumber, phoneSuffix, email } = req.body;
    const otp = otpGenerate();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);
    let user;

    if (email) {
      user = await User.findOne({ email });

      if (!user) {
        user = new User({ email });
      }
      user.emailOtp = otp;
      user.emailOtpExpiry = expiry;
      await user.save();
      await sendOtpToEmail(email, otp);

      return response(res, 200, "OTP đã được gửi đến email của bạn: ", email);
    }

    if (!phoneNumber || !phoneSuffix) {
      return response(res, 400, "Số điện thoại và mã quốc gia là bắt buộc!");
    }
    const fullPhoneNumber = `${phoneSuffix}${phoneNumber}`;
    user = await User.findOne({ phoneNumber });
    if (!user) {
      user = new User({ phoneNumber, phoneSuffix });
    }

    await sendOtpToPhoneNumber(fullPhoneNumber);
    await user.save();

    return response(res, 200, "OTP đã được gửi thành công", user);
  } catch (error) {
    console.error(error);
    return response(res, 500, "Lỗi hệ thống!");
  }
};

// Xác nhận OTP
export const verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, phoneSuffix, email, otp } = req.body;
    let user;

    if (email) {
      user = await User.findOne({ email });
      if (!user) {
        return response(res, 404, "Không tìm thấy User!");
      }

      const now = new Date();
      if (
        !user.emailOtp ||
        String(user.emailOtp) !== String(otp) ||
        now > new Date(user.emailOtpExpiry)
      ) {
        return response(res, 404, "Mã OTP hết hạn hoặc không hợp lệ!");
      }

      user.isVerified = true;
      user.emailOtp = null;
      user.emailOtpExpiry = null;

      await user.save();
    } else {
      if (!phoneNumber || !phoneSuffix) {
        return response(res, 400, "Số điện thoại và mã quốc gia là bắt buộc!");
      }

      user = await User.findOne({ phoneNumber });
      if (!user) {
        return response(res, 404, "Không tìm thấy người dùng!");
      }

      const fullPhoneNumber = `${phoneSuffix}${phoneNumber}`;
      const result = await twilioVerifyOtp(fullPhoneNumber, otp);
      if (result.status !== "approved") {
        return response(res, 400, "Mã OTP không hợp lệ!");
      }

      user.isVerified = true;
      await user.save();
    }

    
    // tạo accessToken với JWT
    const accessToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL },
    );

    // tạo refresh token
    const refreshToken = crypto.randomBytes(64).toString("hex");

    // tạo session mới để lưu refresh token
    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    // trả refresh token về trong cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: REFRESH_TOKEN_TTL,
    });

    return response(res, 200, "Xác nhận OTP thành công", { accessToken, user });
  } catch (error) {
    console.error(error);
    return response(res, 500, "Lỗi hệ thống!");
  }
};

// Đăng xuất
export const logout = async (req, res) => {
  try {
    // lấy refresh token từ cookie
    const token = req.cookies?.refreshToken;

    if (token) {
      // xóa refresh token trong Session
      await Session.deleteOne({ refreshToken: token });

      // xóa cookie
      res.clearCookie("refreshToken");
    }

    return response(res, 200, "Đăng xuất thành công");
  } catch (error) {
    console.error(error);
    return response(res, 500, "Lỗi hệ thống!");
  }
};

export const refreshToken = async (req, res) => {
  try {
    // lấy refresh token từ cookie
    const token = req.cookies?.refreshToken;
    
    if (!token) {
      return response(res, 401, "Token không tồn tại!");
    }

    // so với refresh token trong db
    const session = await Session.findOne({ refreshToken: token });

    if (!session) {
      return response(res, 403, "Token không hợp lệ hoặc đã hết hạn!");
    }

    // kiểm tra hết hạn chưa
    if (session.expiresAt < new Date()) {
      return response(res, 403, "Token đã hết hạn!");
    }

    // tạo access token mới
    const accessToken = jwt.sign(
      { userId: session.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    return response(res, 200, accessToken);
  } catch (error) {
    console.error("Lỗi khi gọi refreshToken", error);
    return response(res, 500, "Lỗi hệ thống");
  }
}