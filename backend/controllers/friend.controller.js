import mongoose from "mongoose";
import Friend from "../models/friend.model.js";
import User from "../models/user.model.js";


export const addFriend = async (req, res)=>{
        const{ senderId, receiverId} = req.body;
        const exInvitation = await Friend.findOne({senderId, receiverId});
if(exInvitation){
    return res.status(400).json({error:"add friend alrealy sent"});
}
const invitation = new Friend({senderId, receiverId});
await invitation.save();
res.status(201).json({success: true, message:"add friend sent succesfully"});
    
};