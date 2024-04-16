import Conversation from "../models/conversation.model.js";
import Friend from "../models/friend.model.js";
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
  try{
const{senderId, receiverId} = req.params
  const deleteInvation = await Friend.findOneAndDelete({senderId,receiverId});
  if(!deleteInvation){
    return res.status(404).json({message:"Invaition not found"});
  }
res.status(200).json({message:'Invation cancelled successfully'});
} catch (error) {
  console.error('Error cancelling invitation:', error);
  res.status(500).json({ error: 'Internal server error' });
}
};




export const acceptInvitation = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    // Update invitation status
    const invitation = await Friend.findOneAndUpdate(
      { senderId, receiverId },
      { accepted: true },
      { new: true }
    );

    if (!invitation) {
      return res.status(404).json({ message: 'Invitation not found' });
    }

    // Create conversation for both users
    const conversation = new Conversation({
      participants: [senderId, receiverId],
    });
    await conversation.save();

    res.status(200).json({ message: 'Invitation accepted successfully' });
  } catch (error) {
    console.error('Error accepting invitation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

