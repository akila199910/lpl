import { createConversationService } from "../services/conversation.service.mjs";

export const createConversationController = async (req, res) => {
    const result = await createConversationService(req.body);
    return res.status(result.success ? 200 : 400).json(result);
  };

  export const createOrGetDMController = async (req, res) => {
    const { receiver, id: sender } = req.body; // 'id' should come from auth ideally
  
    if (!receiver || !sender) {
      return res.status(400).json({
        success: false,
        data: [],
        message: 'sender and receiver are required',
      });
    }
  
    const result = await createConversationService({ sender, receiver });
    return res.status(200).json(result);
  };