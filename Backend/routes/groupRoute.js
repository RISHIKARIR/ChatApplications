import express from 'express'
import { updateGroup } from '../controllers/createConversation.Controller.js';
import { upload } from '../middlewares/multer.js';
import { isGroupAdmin } from '../middlewares/isGroupAdmin.js';
import { verifytoken } from '../middlewares/auth.middlewares.js';
import { removeMember } from '../controllers/group.controller.js';
import { makeAdmin } from '../controllers/group.controller.js';



const router = express.Router();

router.put('/:conversationId/update',verifytoken,isGroupAdmin,upload.single("group_image"),updateGroup);
router.put('/:conversationId/members/:memberId',verifytoken,isGroupAdmin,removeMember);
router.put('/:conversationId/makeAdmin/:memberId',verifytoken,isGroupAdmin,makeAdmin)




export default router;