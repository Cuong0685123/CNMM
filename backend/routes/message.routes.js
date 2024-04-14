import express from "express";
import { createMessage, getMessages, getallmess, revokedMessage, sendMessage } from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
router.post("/", upload.array('files'),createMessage);
router.get('/:conversationId/conversation',getallmess );
router.get('/:senderId/message',revokedMessage );

export default router;
