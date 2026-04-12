import express from 'express';
import { sendDirectMessage, sendGroupMessage } from '../controllers/messageController.js';
import { checkGroupMembership } from '../middlewares/friendMiddlware.js';

const router = express.Router();

router.post('/direct', sendDirectMessage);

router.post('/group', checkGroupMembership, sendGroupMessage);

export default router;