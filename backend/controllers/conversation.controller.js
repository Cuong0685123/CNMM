import mongoose from "mongoose";
import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";

export const createConversation = async (req, res) => {
  const { userIds } = req.body;
  console.log({ userIds });
  const conversation = await Conversation.create({
    participants: userIds,
  });
  return res.status(201).json({ data: conversation });
};

export const getconversationbyuserid = async (req, res) => {
  const { userId } = req.params;
  console.log({ userId });
  const arrayCondition = [userId];
  const conversations = await Conversation.find({
    participants: { $in: arrayCondition },
  })
    .populate("participants")
    .populate("messages");

  conversations.messages = conversations?.messages?.slice(-1) ?? []

  return res.status(200).json({ data: conversations });
};
export const deleteuser = async (req, res) => {
  try {
    const { conversationId, userId } = req.params;

    // Kiểm tra xem người dùng tồn tại trong nhóm không
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: "conversation not found" });
    }

    const userIndex = conversation.participants.indexOf(userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found in conversation" });
    }
    // Xoá người dùng khỏi nhóm
    conversation.participants.splice(userId, 1);
    await conversation.save();
    return conversation();

    // Cập nhật thông tin người dùng
  } catch (error) {
    console.error("Error removing user from converstaion:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
