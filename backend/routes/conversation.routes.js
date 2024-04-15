import express from "express";
import { createConversation, deleteuser, getconversationbyuserid } from "../controllers/conversation.controller.js";

const router = express.Router();

router.post("/", createConversation);
router.get("/:userId/user", getconversationbyuserid);
router.delete("/:userId/:conversationId", deleteuser);

export default router;
