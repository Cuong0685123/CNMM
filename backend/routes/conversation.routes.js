import express from "express";
import { createConversation, getconversationbyuserid } from "../controllers/conversation.controller.js";

const router = express.Router();

router.post("/", createConversation);
router.get("/:userId/user", getconversationbyuserid);
export default router;
