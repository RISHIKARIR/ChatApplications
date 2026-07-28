import express from 'express'
import { updateGroup } from '../controllers/createConversation.Controller.js';
import { upload } from '../middlewares/multer.js';



const router = express.Router();

router.put('/:conversationId/update',upload.single("group_image"),updateGroup);



export default router;