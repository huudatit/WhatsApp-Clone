import express from 'express';
import { sendDirectMessage, sendGroupMessage } from '../controllers/messageController.js';
import { checkGroupMembership } from '../middlewares/friendMiddlware.js';
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post('/direct', upload.single('file'), sendDirectMessage);

router.post('/group', checkGroupMembership, upload.single('file'), sendGroupMessage);

export default router;