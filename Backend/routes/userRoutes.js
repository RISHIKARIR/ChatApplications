import express from "express";
import { verifytoken } from "../middlewares/auth.middlewares";
// import { profile } from "../controllers/userController.js";
import { ProfileSave } from "../controllers/createConversation.Controller";




const router = express.Router();





router.post("/profile/save",verifytoken,ProfileSave)





export default router;