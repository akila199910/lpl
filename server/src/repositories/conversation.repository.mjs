import mongoose from 'mongoose';
import { Conversation } from '../models/conversation.model.mjs';
import { Message } from '../models/message.model.mjs';

export const createConversationRepository = async (payload) => {
  try {
    console.log(payload)
    const conversation = await Conversation.findOneAndUpdate(
      { dmKey: payload.dmKey },
      {
        $setOnInsert: {
          participants: [
            new mongoose.Types.ObjectId(payload.sender),
            new mongoose.Types.ObjectId(payload.receiver),
          ],
          lastMessageAt: null,
        },
      },
      { new: true, upsert: true }
    );

    return conversation;
  } catch (err) {
    if (err?.code === 11000) {
      // Another request created it first — just fetch it
      return await Conversation.findOne({ dmKey: payload.dmKey });
    }
    throw err;
  }
};


  
