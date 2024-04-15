
import Friend from "../models/friend.model.js";
import User from "../models/user.model.js";
export const addFriend = async (req, res)=>{
        const{ senderId, receiverId} = req.body;
        const exInvitation = await Friend.findOne({senderId, receiverId});
        console.log({senderId})
        console.log({receiverId})
if(exInvitation){
    return res.status(400).json({error:"add friend alrealy sent"});
}
const invitation = new Friend({senderId, receiverId});
await invitation.save();
res.status(201).json({success: true, message:"add friend sent succesfully"});
    
};

export const deleteInvation = async (req, res)=>{
const{userId} = req.params
await Friend.findByIdAndDelete(userId);
res.status(200).json({message:'Invation cancelled successfully'});
};