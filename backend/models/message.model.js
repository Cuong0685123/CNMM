import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		conversationId:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Conversation",
			required: true,
		},
	
		text: {
			type: String,
			
		},
		files:{
			type: [String],
			require:true,
		},
		recallAt: {
			type: Date,
		  },
		  deleteAt: {
			type: Date,
		  },
		// createdAt, updatedAt
	},
	{ timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
