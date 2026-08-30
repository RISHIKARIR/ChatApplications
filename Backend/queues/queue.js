import { Queue } from "bullmq";
import dotenv from "dotenv"


const connection = {
    host : "localhost",
    port : 6379
}


const emailQueue = new Queue("emails",{ connection });



export { connection,emailQueue } 
