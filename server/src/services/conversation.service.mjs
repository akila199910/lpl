import { createConversationRepository } from "../repositories/conversation.repository.mjs";
import { successResponse } from "../utils/apiResponse.mjs";

export const createConversationService = async (msgData) => {
    // Ensure IDs are always in sorted order to prevent duplicate keys for reversed pairs
    const [a, b] = [msgData.sender, msgData.receiver].map(String).sort();
    const dmKey = `${a}#${b}`;
  
    const payload = { ...msgData, sender: a, receiver: b, dmKey };
    const conversation = await createConversationRepository(payload);
  
    return { success: true, data: conversation };
  };
  