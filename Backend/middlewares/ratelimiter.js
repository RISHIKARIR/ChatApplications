import { redis } from "../db/redis.js";


    //sliding window rate limiter
export const ratelimiter = async(req,res,next)=>{

    const key = `rate:user:${req.ip}`;
    const windowMs = 60 * 1000;
    const now = new Date();


    await redis.zremrangebyscore(key,0,now-windowMs);


    const count = await redis.zcard(key);

    if(count >= 10){
        return res.status(429).json({
            message : "too Many Requests"
        })
    }




    await redis.zadd(key,now,`${now}-${Math.random()}`)
    await redis.expire(key,60);

    next();


}