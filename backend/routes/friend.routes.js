import express from "express";
import { addFriend } from "../controllers/friend.controller";

const router = express.Router();

router.post("/addFriend", addFriend);

export default router;