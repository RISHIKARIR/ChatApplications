import express from "express"
import { showMessages,createMessage } from "../controllers/messages.controller.js";
import { verifytoken } from "../middlewares/auth.middlewares.js";
const router = express.Router();




router.get("/:conversationId/messages",verifytoken,showMessages);
router.post("/:conversationId/message",verifytoken,createMessage);
// router.put("/message/:id",verifytoken,editMessage);






export default router;