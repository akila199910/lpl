import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.mjs';
import { createOrGetDMController } from '../controllers/conversation.controller.mjs';

const conversationRouter = Router();


conversationRouter.post('/dm', authMiddleware, createOrGetDMController);

export default conversationRouter;
