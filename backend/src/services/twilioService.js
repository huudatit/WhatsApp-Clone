import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;

const client = twilio(accountSid, authToken);

// Gửi OTP đến sđt
export const sendOtpToPhoneNumber = async (phoneNumber) => {
  try {
    console.log("Đang gửi OTP đến số này ", phoneNumber);

    if (!phoneNumber) {
      throw new Error("Yêu cầu số điện thoại!");
    }

    const response = await client.verify.v2
      .services(serviceSid)
      .verifications.create({
        to: phoneNumber,
        channel: "sms",
      });
    console.log("Đây là mã OTP của tôi ", response);
    return response;
  } catch (error) {
    console.error(error);
    throw new Error("Lỗi gửi OTP!");
  }
};

// Xác nhận OTP
export const verifyOtp = async (phoneNumber, otp) => {
  try {
    console.log("Đây là mã OTP của tôi");
    console.log("Số điện thoại: ", phoneNumber)

    const response = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({
        to: phoneNumber,
        code: otp,
      });
    console.log("Đây là mã OTP của tôi", response);
    return response;
  } catch (error) {
    console.error(error);
    throw new Error("Lỗi xác nhận OTP!");
  }
};