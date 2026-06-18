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

import http, { createServer } from "http";
import { Server } from "socket.io";
import { initialiseSocket } from "./socket/index.js";
import { AllTables } from "./models/relations.js";

const app = express();
const server = createServer(app);

const io = new Server(server,{
    cors : {
        origin : "http://localhost:3000",
        credentials : true,
        // methods : ["GET","POST"]
    }
})






app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: ["http://localhost:3000" ], credentials: true ,methods: ["GET", "POST"],}));

connectDb();
const path = process.env.PORT || 5000;

seq.sync({alter : true});

app.use("/user", conversation);
app.use("/user", messages);

app.use("/auth", authRoutes);


// export const  server = http.createServer(app);

initialiseSocket(io);


// initialiseSocket(server);


server.listen(path, () => console.log(` ${path} running`));
