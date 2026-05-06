import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    console.log("CHUỖI KẾT NỐI LÀ:", process.env.MONGODB_CONNECTIONSTRING);
    await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
    console.log('Liên kết CSDL thành công!');
  } catch (error) {
    console.log('Lỗi khi kết nối CSDL: ', error);
  }
};