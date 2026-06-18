import express from 'express';
import { register } from '../controllers/registerController.js';
import { login } from '../controllers/loginController.js';
import { GenerateNewAccess } from "../controllers/GenerateNewAccess.js"
import { logout } from '../controllers/logoutConroller.js';
import { Authme } from '../controllers/auth.Controller.js';
import { verifytoken } from '../middlewares/auth.middlewares.js';


const router = express.Router();



router.post('/register',register)
router.post('/login',login)
router.post('/generateAccess',GenerateNewAccess)
router.post('/logout',logout)


router.get('/me',verifytoken,Authme)



export default router;