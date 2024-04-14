import express from "express";
import { createConversation, deleteuser, getconversationbyuserid } from "../controllers/conversation.controller.js";

const router = express.Router();

router.post("/", createConversation);
router.get("/:userId/user", getconversationbyuserid);
router.get("/:conversationId/conversations/:userId/user", deleteuser);

export default router;
