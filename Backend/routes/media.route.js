import { uploadMedia } from "../controllers/mediaController.js";
import express from 'express';
import { verifytoken } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();



router.post("/uploadMedia",verifytoken,upload.array('files', 12),uploadMedia)



export default router;

