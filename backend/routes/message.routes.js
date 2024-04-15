import express from "express";
import {
  createMessage,
  getMessages,
  getallmess,
  revokedMessage,
  sendMessage,
} from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";
import multer from "multer";
import AWS from "aws-sdk";
import multerS3 from "multer-s3";
// import { storage } from "../controllers/message.controller.js";

const router = express.Router();

console.log(process.env.AWS_BUCKET_NAME)
AWS.config.update({
    region: process.env.REGION,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

const storage = multerS3({
  s3: s3,
  bucket: process.env.AWS_BUCKET_NAME,
  acl: "public-read",
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: function (req, file, cb) {
    cb(null, "uploads/" + Date.now().toString() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
router.post("/send-message", upload.array("files"), createMessage);
router.get("/:conversationId/conversation", getallmess);
router.delete("/:senderId/message", revokedMessage);

export default router;
