import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
	{
		name:String, 
		avatar:String,
		admin:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		participants: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		messages: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Message",
				default: [],
			},
		],
	},
	{ timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
