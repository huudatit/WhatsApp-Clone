import express from 'express';
import { sendDirectMessage, sendGroupMessage } from '../controllers/messageController.js';
import { checkGroupMembership } from '../middlewares/friendMiddleware.js';
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post('/direct', upload.single('file'), sendDirectMessage);

router.post('/group', upload.single('file'), checkGroupMembership,  sendGroupMessage);

export default router;