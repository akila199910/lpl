import { Conversation } from "../models/conversation.model.mjs";
import { listMessagesRepository, sendMessageRepository } from "../repositories/message.repository.mjs"

export const listMessagesService = async (conversationData) => {

    const q = await listMessagesRepository(conversationData)
    return q;
}

export const sendMessageService = async(chatData)=> {

    const conversation = await Conversation.findById(chatData.conversationId);

    if(!conversation){
        return res.status(404).json({ success: false, data: [] ,message: 'Conversation not found' });
    }
    if (chatData.id && !conversation.participants.map(String).includes(String(chatData.id))) {
        return res.status(403).json({ success: false, dta:[] ,message: 'Not a participant' });
      }

    const q = await sendMessageRepository(chatData,conversation)
    return q;
}