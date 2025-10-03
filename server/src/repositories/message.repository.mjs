import mongoose from "mongoose";
import { Message } from '../models/message.model.mjs';

export const listMessagesRepository = async (conversationData) => {


    const q = { conversationId: new mongoose.Types.ObjectId(conversationData.conversationId) };

    if (conversationData.before && conversationData.before !== 'undefined') {
        const d = new Date(conversationData.before);
        if (!Number.isNaN(d.getTime())) {
          q.createdAt = { $lt: d };
        }
      }
  
    const msgs = await Message.find(q)
        .sort({ createdAt: 1 })
        .limit(Number(conversationData.limit));

    return msgs;
}


export const sendMessageRepository = async (chatData,conversation) =>{

    const message = await Message.create({
        conversationId: chatData.conversationId,
        senderId: new mongoose.Types.ObjectId(chatData.id),
        text: chatData.text.trim(),
    });

    conversation.lastMessageAt = new Date();
    await conversation.save();

    return message;
}