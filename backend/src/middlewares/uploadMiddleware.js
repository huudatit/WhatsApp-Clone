import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

// cấu hình Multer lưu vào RAM
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 1, // 1MB
  },
});

// hàm helper upload từ buffer lên Cloudinary
export const uploadImageFromBuffer = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "whatsapp_clone/avatars",
        resource_type: "image",
        transformation: [{ width: 200, height: 200, crop: "fill" }],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  })
}