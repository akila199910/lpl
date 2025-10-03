import { Router } from "express";
import { handleValidationErrors } from "../middlewares/validationErrorHandler.mjs";
import { authMiddleware } from "../middlewares/authMiddleware.mjs";
import { createConversationController } from "../controllers/conversation.controller.mjs";
import { asyncHandler } from "../utils/asyncHandler.mjs";
import { listMessagesController, sendMessageController } from "../controllers/message.controller.mjs";

const messageRouter = Router();

// messageRouter.post('/', authMiddleware, createConversationController)

messageRouter.get('/',authMiddleware, listMessagesController);

messageRouter.post('/',authMiddleware, sendMessageController);

export default messageRouter;