import redis from "redis";

const redisClient = await redis.createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => console.error("Redis Error:", err));
await redisClient.connect();

export default redisClient;
