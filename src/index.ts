import session from "express-session";
import Redis from "ioredis";
import connectRedis from "connect-redis";
import { REDIS_CONFIG, APP_PORT, MONGO_URI, MONGO_OPTION } from "./config";
import mongoose from "mongoose";
import { AppConfig } from "./app";
(async () => {
  await mongoose.connect(MONGO_URI, MONGO_OPTION);
  const RedisStore = connectRedis(session);
  const client = new Redis(REDIS_CONFIG);
  const store = new RedisStore({ client });
  const app = AppConfig(store);
  app.listen(3000, () => console.log(`http://localhost:${APP_PORT}`));
})();
