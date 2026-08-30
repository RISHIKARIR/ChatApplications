import { Worker } from "bullmq";
import { connection, emailQueue } from "../queues/queue.js";


export const emailWorker = new Worker("emails",async (job)=>{
    console.log("job processing...",job.id,job.name,job.data);
    // (await new Promise((resolve)=>setTimeout(resolve,2000)))

    console.log("businesssssssssssss");



},
{connection})

emailWorker.on("completed",(job)=>{
    console.log("Job has been completed",job.id,job.name,job.data)
})


emailWorker.on("failed",(job,err)=>{    

    console.log("failed jobbbb");
    console.log("error occured",job.id,job.name,job.data);

})