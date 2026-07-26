import express from "express"
import { showMessages,createMessage } from "../controllers/messages.controller.js";
import { verifytoken } from "../middlewares/auth.middlewares.js";
import { isActiveMember } from "../middlewares/isActiveGroupMember.js";
const router = express.Router();




router.get("/:conversationId/messages",isActiveMember,verifytoken,showMessages);
router.post("/:conversationId/message",verifytoken,isActiveMember,createMessage);
// router.put("/message/:id",verifytoken,editMessage);




export default router;