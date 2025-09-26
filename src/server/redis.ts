// import Redis from "ioredis";
// import dotenv from 'dotenv';



// dotenv.config({ path: "../../.env" }); // relative path from /server to root .env.local
// // dotenv.config()

// // if (!process.env.REDIS_HOST || !process.env.REDIS_PORT || !process.env.REDIS_PASSWORD) {
// //   throw new Error("Redis environment variables not set!");
// // }

// // Publisher (for sending messages)
// export const redisPub = new Redis({
//   host: process.env.REDIS_HOST,
//   // port: Number(process.env.REDIS_PORT),
//   port: Number(process.env.REDIS_PORT),
//   password: process.env.REDIS_PASSWORD,
//   // retryStrategy: times => Math.min(times * 50, 2000), // auto retry
// });

// // Subscriber (for receiving messages)
// export const redisSub = new Redis({
//   host: process.env.REDIS_HOST,
//   port: Number(process.env.REDIS_PORT),
//   password: process.env.REDIS_PASSWORD,
//   // retryStrategy: times => Math.min(times * 50, 2000),
// });

// console.log("REDIS_HOST:", process.env.REDIS_HOST);
// console.log("REDIS_PORT:", process.env.REDIS_PORT);
// console.log("REDIS_PASSWORD:", process.env.REDIS_PASSWORD);

// // Optional: check connection
// redisPub.on("connect", () => console.log("Redis Publisher connected ✅"));
// redisSub.on("connect", () => console.log("Redis Subscriber connected ✅"));

// redisPub.on("error", (err) => console.error("Redis Publisher Error:", err));
// redisSub.on("error", (err) => console.error("Redis Subscriber Error:", err));
