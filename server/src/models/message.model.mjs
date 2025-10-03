import mongoose from "mongoose";
const { Schema, Types } = mongoose;

const messageSchema = new Schema({
    conversationId: { type: Types.ObjectId, ref: 'Conversation', required: true },
    senderId: { type: Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, trim: true },
  },

  { timestamps: { createdAt: true, updatedAt: false } }
);

messageSchema.index({ conversationId: 1, createdAt: 1 });

export const Message = mongoose.model('Message', messageSchema);
