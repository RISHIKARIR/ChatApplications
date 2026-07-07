import express from "express";
import { verifytoken } from "../middlewares/auth.middlewares.js";
import { ProfileSave } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.js";



const router = express.Router();





router.post("/profile/save",verifytoken,upload.single("image"),ProfileSave)





export default router;