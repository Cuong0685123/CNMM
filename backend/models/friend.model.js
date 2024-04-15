import mongoose from "mongoose";

const friendSchema = new mongoose.Schema(
    {
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu đến model User, người gửi lời mời
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu đến model User, người nhận lời mời
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'], // Trạng thái của lời mời
    default: 'pending'
  },
  sentAt: {
    type: Date,
    default: Date.now
  }
});

const Friend = mongoose.model("Message", friendSchema);

export default Friend;
