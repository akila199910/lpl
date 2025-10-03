import mongoose from "mongoose";
const { Schema, Types } = mongoose;

const conversationSchema = new Schema({

    participants: [{ type: Types.ObjectId, ref: 'User', required: true }],
    dmKey: { type: String, index: true, unique: true }, 
    lastMessageAt: { type: Date, default: null }
    
  }, { timestamps: true });

conversationSchema.pre('validate', function(next) {
  if (Array.isArray(this.participants) && this.participants.length === 2) {
    const [sender, receiver] = this.participants.map(String).sort();
    this.dmKey = `${sender}#${receiver}`;
  }
  next();
});

export const Conversation = mongoose.model('Conversation', conversationSchema);
