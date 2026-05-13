import express from 'express';
import { upload } from '../middlewares/uploadMiddleware.js';
import { updateProfile, searchUserByUsername } from '../controllers/userController.js'; 

const router = express.Router();

router.get("/search", searchUserByUsername);
router.put("/update-profile", upload.single("file"), updateProfile);

export default router;