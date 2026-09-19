const {createClient} = require("redis");
require('dotenv').config();

console.log("Redis URL exists:", !!process.env.REDIS_URL);

const redis = createClient({url: process.env.REDIS_URL});

redis.on("error", (err) => {
    console.error("Redis Error: ", err);
});

async function connectRedis(){
    console.log("Attempting Redis connection...");
    if(!redis.isOpen) {
        await redis.connect();
    }
    console.log("Redis connected")
}

module.exports = {
    redis,
    connectRedis
};