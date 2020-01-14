import { APP_PORT, MONGO_URI, MONGO_OPTION } from "./config";
import mongoose from "mongoose";
import { AppConfig } from "./app";
(async () => {
  await mongoose.connect(MONGO_URI, MONGO_OPTION);
  const app = AppConfig();
  app.listen(3000, () => console.log(`http://localhost:${APP_PORT}`));
})();
