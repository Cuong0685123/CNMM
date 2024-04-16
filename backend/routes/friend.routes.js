import express from "express";
import { addFriend, deleteInvation, acceptInvitation } from "../controllers/friend.controller.js";

const router = express.Router();

router.post("/", addFriend);
router.delete('/:senderId/:receiverId', deleteInvation);
router.put('/:senderId/:receiverId/accept', acceptInvitation);

export default router;