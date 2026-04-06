import User from "../models/User";
import otpGenerater from "../utils/otpGenerater";
import response from "../utils/responseHandler";


// Send Otp
const sendOtp = async (req, res) => {
  const { phoneNumber, phoneSuffix, email } = req.body;
  const otp = otpGenerater();
  const expiry = new Date(Date.now() + 5 * 60 * 1000);
  let user;
  try {
    if (email) {
      user = await User.findOne({ email });

      if (!user) {
        user = new User({ email });
      }
      user.emailOtp = otp;
      user.emailOtpExpiry = expiry;
      await user.save();

      return response(res, 200, "OTP đã được gửi đến email của bạn: ", email)
    }

    if (!phoneNumber || !phoneSuffix) {
      return response(res, 400, "Số điện thoại và mã quốc gia là bắt buộc!");
    }
    const fullPhoneNumber = `${phoneSuffix}${phoneNumber}`;
    user = await User.findOne({ phoneNumber });
    if (!user) {
      user = await new User({ phoneNumber, phoneSuffix });
    }

    await user.save();

    return response(res, 200, 'OTP đã được gửi thành công', user);
  } catch (error) {
    console.error(error);
    return response(res, 500, 'Lỗi hệ thống!');
  }
}