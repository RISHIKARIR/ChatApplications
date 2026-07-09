import express from "express";
import { showConversations, } from "../controllers/showConversationController.js";
import { verifytoken } from "../middlewares/auth.middlewares.js";
import { createConversation,createGroup } from "../controllers/createConversation.Controller.js";
import { upload } from "../middlewares/multer.js";


const router = express.Router();


router.get("/conversations",verifytoken,showConversations)
router.post("/conversations",verifytoken,createConversation)
router.post("/conversations/group",upload.single("groupImage"),verifytoken,createGroup)






export default router;