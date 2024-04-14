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

export const getconversationbyuserid = async (req, res)=>{
    const{userId} = req.params;
    console.log({userId});
      // Define your array condition
      const arrayCondition = [userId];
      
      // Use the find method with the array condition
      const conversations = await Conversation.find({ participants: { $in: arrayCondition } });

      return res.status(200).json({data: conversations})
      

};
