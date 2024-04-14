import { Server } from "socket.io";
import http from "http";
import express from "express";
import bodyParser from "body-parser";

const app = express();
// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "*",
		
	},
});

export const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}


io.on("connection", (socket) => {
	console.log("a user connected", socket.id);
	socket.on("join rooms", (conversationid, msg) => {
		socket.to(conversationid).emit("join rooms ", socket.id, msg);
	
	const userId = socket.handshake.query.userId;
	if (userId != "undefined") userSocketMap[userId] = socket.id;

	// io.emit() is used to send events to all the connected clients
	io.emit("getOnlineUsers", Object.keys(userSocketMap));
//io.emit("getConversation"), Object.keys(userSocketMap);
	// socket.on() is used to listen to the events. can be used both on client and server side
	socket.on("disconnect", () => {
		console.log("user disconnected", socket.id);
		delete userSocketMap[userId];
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});
});

export { app, io, server };
