import { listMessagesService, sendMessageService } from "../services/message.service.mjs";

export const listMessagesController = async (req, res) => {
  const { conversationId, limit = 50 } = req.query;

  const conversationData = { conversationId, limit  } 

  if (!conversationId) {
    return res.status(400).json({ success: false, 'data': [], message: 'conversationId is required'});
  }

  const msgList = await listMessagesService(conversationData);

  return res.json({ success: true, data: msgList, message:'message list' });
};

export const sendMessageController = async (req, res) => {
  const chatData = req.body;

  if(!chatData.conversationId){
    return res.status(400).json({ success: false, data: [], message: 'conversationId is missing'})
  }
  if(!chatData.text){
    return res.status(400).json({ success: false, data: [], message: 'Text is missing'})
  }
  if(!chatData.id){
    return res.status(400).json({ success: false, data: [], message: 'sender id is missing'})
  }

  const saveMessage = await sendMessageService(chatData);

  return res.status(201).json({ success: true, data: saveMessage, message: 'message saved success' });
};
