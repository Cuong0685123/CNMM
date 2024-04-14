import multer from "multer";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import AWS from "aws-sdk";
import fs from "fs";

const s3 = new AWS.S3();

const bucketName = process.env.S3_BUCKET_NAME;
AWS.config.update({
    region: process.env.REGION,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
});





export const sendMessage = async (req, res) => {
	try {
		const { message } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}

		const newMessage = new Message({
			senderId,
			receiverId,
			message,
		});

		if (newMessage) {
			conversation.messages.push(newMessage._id);
		}

		//await conversation.save();
		 //await newMessage.save();

		// this will run in parallel
		await Promise.all([conversation.save(), newMessage.save()]);

		// SOCKET IO FUNCTIONALITY WILL GO HERE
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			// io.to(<socket_id>).emit() used to send events to specific client
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}

		res.status(201).json(newMessage);
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

		if (!conversation) return res.status(200).json([]);

		const messages = conversation.messages;

		res.status(200).json({data: messages});
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
export const upload = async (req,res) => {
    const uploadedFiles = [];
    try {
        const files = req.files
		console.log(files)
        if (!files) {
            throw new Error('No files found in the request');
        }

        for (const key in files) {
            if (Object.hasOwnProperty.call(files, key)) {
                const filePath = files[key].path;
                if (filePath) {
                    const fileData = fs.readFileSync(filePath); // Đọc dữ liệu từ file
                    const fileName = files[key].originalname;

                    // Chuyển đổi dữ liệu từ Buffer sang kiểu dữ liệu phù hợp
                    const fileBody = fileData instanceof Buffer ? fileData : Buffer.from(fileData, 'binary');

                    const fileUrl = await upload(fileBody, fileName); // Thay uploadToS3 bằng hàm upload thực tế
                    uploadedFiles.push(fileUrl);
                } else {
                    console.error('filePath is not found for file with key:', key);
                }
            }
        }
    } catch (error) {
        console.error('Error uploading file:', error);
    }
    return uploadedFiles;
};

export const createMessage = async (req, res) =>{
	const {conversationId, senderId, text} = req.body;
	const files = req.files
	console.log(files);
  const message = await Message.create({
    conversationId: conversationId,
	senderId, text
  });
  const uploadedFilesUrls = await upload(files);
  return res.status(201).json({data: message, uploadedFiles: uploadedFilesUrls });
}
export const getallmess = async (req, res) =>{
	const{conversationId} = req.params;
    console.log({conversationId});
      
      const arrayCondition = [conversationId];
      
      const messages = await Message.find({ conversationId: { $in: arrayCondition } });

      return res.status(200).json({data: messages})
}

export const revokedMessage = async (req, res)=>{
	try {
		const {senderId} =req.params;
	console.log({senderId});
	const message = await Message.findById(senderId);
	if(!message){
		return res.status(404).json({error:'Message not found'});
	}
	await Message.findByIdAndDelete(senderId);
	res.status(200).json({succes:true,message:"Message delete successfully"});
	} catch (error) {
		console.error('Error revoking message:', error);
		res.status(500).json({ error: 'Internal server error' });
	}  
	};

	export const deleteMessage = async(req, res)=>{

		try {
			const senderId = req.params;
		
			// Kiểm tra xem tin nhắn tồn tại không
			const message = await Message.findById(senderId);
			if (!message) {
			  return res.status(404).json({ error: 'Message not found' });
			}
		
			// Đặt thời gian deleteAt của tin nhắn là thời gian hiện tại
			message.deleteAt = new Date();
			await message.save();
		
			res.status(200).json({ success: true, message: 'Message deleted successfully' });
		  } catch (error) {
			console.error('Error deleting message:', error);
			res.status(500).json({ error: 'Internal server error' });
		  }
		};
	


