import express from 'express';
import { upload } from '../middlewares/uploadMiddleware.js';
import {
  authMe,
  searchUserByUsername,
  updateProfile,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/me", authMe);

router.get("/search", searchUserByUsername);

router.patch("/profile", upload.single("file"), updateProfile);

export default router;