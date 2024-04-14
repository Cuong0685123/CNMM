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
export const upload = async (req) => {
    const uploadedFiles = [];
    
    try {
        // Kiểm tra xem yêu cầu có chứa files không
        if (!req.files || Object.keys(req.files).length === 0) {
            throw new Error('No files were uploaded.');
        }

        // Lặp qua từng file trong req.files
        for (const key in req.files) {
            if (Object.hasOwnProperty.call(req.files, key)) {
                const file = req.files[key];

                // Kiểm tra xem file có tồn tại hay không
                if (!file) {
                    console.error('No file found with key:', key);
                    continue; // Bỏ qua file nếu không tìm thấy
                }

                const filePath = file.path;

                // Đọc dữ liệu từ file
                const fileData = fs.readFileSync(filePath);

                // Tiếp tục xử lý dữ liệu file và upload lên S3 hoặc nơi lưu trữ khác
                const fileName = file.originalname;
                const fileUrl = await uploadToS3(fileData, fileName); // Thay uploadToS3 bằng hàm upload thực tế

                // Thêm fileUrl vào mảng uploadedFiles
                uploadedFiles.push(fileUrl);
            }
        }
    } catch (error) {
        console.error('Error uploading files:', error);
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


