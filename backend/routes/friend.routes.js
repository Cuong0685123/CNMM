import express from "express";
import { addFriend, deleteInvation } from "../controllers/friend.controller.js";

const router = express.Router();

router.post("/", addFriend);
router.delete('/:userId/user', deleteInvation);

export default router;