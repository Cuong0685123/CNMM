import multerS3 from "multer-s3";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import AWS from "aws-sdk";
import { configDotenv } from "dotenv";
configDotenv();

// process.env.AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE = "1";
// // const upload = multer({ dest: 'uploads/' });
// const s3 = new AWS.S3();

// AWS.config.update({
//     region: process.env.REGION,
//     accessKeyId: process.env.ACCESS_KEY_ID,
//     secretAccessKey: process.env.SECRET_ACCESS_KEY,
// });

// console.log(process.env.AWS_BUCKET_NAME)
// const storage = multerS3({
// 	s3: s3,
// 	bucket: process.env.AWS_BUCKET_NAME,
// 	acl: 'public-read',
// 	contentType: multerS3.AUTO_CONTENT_TYPE,
// 	key: function (req, file, cb) {
// 	  cb(null, 'uploads/' + Date.now().toString() + '-' + file.originalname);
// 	},
//   });

//   export { storage };

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

    res.status(200).json({ data: messages });
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createMessage = async (req, res) => {
  const { conversationId, senderId, text } = req.body;
  // console.log(files);
  const uploadedFilesUrls = req.files.map((file) => file.location);
  const message = await Message.create({
    conversationId: conversationId,
    senderId,
    text,
    files: uploadedFilesUrls,
  });
  return res
    .status(201)
    .json({ data: message, uploadedFiles: uploadedFilesUrls });
};
export const getallmess = async (req, res) => {
  const { conversationId } = req.params;
  console.log({ conversationId });

  const arrayCondition = [conversationId];

  const messages = await Message.find({
    conversationId: { $in: arrayCondition },
  });

  return res.status(200).json({ data: messages });
};

export const revokedMessage = async (req, res) => {
  try {
    const { senderId } = req.params;
    console.log({ senderId });
    const message = await Message.findById(senderId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }
    await Message.findByIdAndDelete(senderId);
    res
      .status(200)
      .json({ succes: true, message: "Message delete successfully" });
  } catch (error) {
    console.error("Error revoking message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { senderId } = req.params;

    // Kiểm tra xem tin nhắn tồn tại không
    const message = await Message.findById(senderId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Đặt thời gian deleteAt của tin nhắn là thời gian hiện tại
    Message.deleteAt = new Date();
    await Message.save();

    res
      .status(200)
      .json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
