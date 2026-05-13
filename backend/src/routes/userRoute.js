import express from 'express';
import { upload } from '../middlewares/uploadMiddleware.js';
import { getMe, searchUser, updateProfile } from '../controllers/userController.js';

const router = express.Router();

router.get("/me", getMe);

router.get("/search", searchUser);

router.put("/updateAvatar", upload.single("file"), updateProfile);

export default router;