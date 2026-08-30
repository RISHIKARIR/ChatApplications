import "dotenv/config";
import express from "express";
import { connectDb, seq } from "./db/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import user from "./routes/userRoutes.js";
import conversation from "./routes/conversations.route.js";
import { verifytoken } from "./middlewares/auth.middlewares.js";
import messages from "./routes/messages.routes.js";
import cors from "cors";
import mediaRoute from "./routes/media.route.js"
import groupRoute from "./routes/groupRoute.js"


import http, { createServer } from "http";
import { Server } from "socket.io";
import { initialiseSocket } from "./socket/index.js";
import { AllTables } from "./models/relations.js";
import { conversation_members } from "./models/conversation.js";
import { redis } from "./db/redis.js";
import "./workers/index.js"




const app = express();
const server = createServer(app);



console.log(process.env.CLIENT_URL,"hfiuhffuihbfu");
export const io = new Server(server,{
    cors : {
        origin : process.env.CLIENT_URL,
        credentials : true,
    }
})



app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: [process.env.CLIENT_URL], credentials: true ,methods: ["GET", "POST","PUT","DELETE"],}));

connectDb();
const path = process.env.PORT || 5000;

// seq.sync({alter : true});




const queue_key = 'queue:emails';



app.post('/emails',async (req,res)=>{
    const job = {
        to : req.body.to,
        subject : req.body.subject,
        content : req.body.content,
        createdAt : new Date().toISOString()
    }

    await redis.lpush(queue_key,JSON.stringify(job));
    
    res.status(200).json({
        enqueued : true,
        job
    })




})




app.get("/getjob",async (req,res)=>{
    const rawJob = await redis.rpop(queue_key);

    if(!rawJob){
        return res.status(200).json({
            message : "no jobs queued"
        })
    }


    const job = JSON.parse(rawJob);


    
    return res.status(200).json({
        message : "jobs returned",
        job
    })



})




app.use("/user", conversation);
app.use("/user", messages);
app.use("/user",user)
app.use('/user',groupRoute)

app.use("/user/media",mediaRoute);

app.use("/auth", authRoutes);


// export const  server = http.createServer(app);

initialiseSocket(io);




// initialiseSocket(server);


server.listen(path, () => console.log(` ${path} running`));
