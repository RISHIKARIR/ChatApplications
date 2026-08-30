import express from 'express';
import { register } from '../controllers/registerController.js';
import { login } from '../controllers/loginController.js';
import { GenerateNewAccess } from "../controllers/GenerateNewAccess.js"
import { logout } from '../controllers/logoutConroller.js';
import { Authme } from '../controllers/auth.Controller.js';
import { verifytoken } from '../middlewares/auth.middlewares.js';
import { emailQueue } from '../queues/queue.js';
import { ratelimiter } from '../middlewares/ratelimiter.js';


const router = express.Router();



router.use(ratelimiter);


router.post('/register',register)
router.post('/login',login)
router.post('/generateAccess',GenerateNewAccess)
router.post('/logout',logout)


// router.post("/sendEmail",async(req,res)=>{

//  const job =  await emailQueue.add("send-email",{
//         to : "rishi@gmail.com",
//         subject : "subject",
//         content : "This is content"
//     },
//     {
//         attempts : 3,
//         backoff : { 
//         type : "exponential",
//         delay : 1000
//         }
//     }
// )

//     return res.status(200).json({
//         message : "sentttt",
//         jobId : job.id
//     })


// })




router.get('/me',verifytoken,Authme)




export default router;