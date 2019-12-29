import { ConnectionOptions } from "mongoose";

export const {
  MONGO_USERNAME = "admin",
  MONGO_PASSWORD = "secret",
  MONGO_HOST = "35.240.183.154",
  MONGO_PORT = "27017",
  MONGO_DATABASE = "ProjectC"
} = process.env;

export const MONGO_URI = `mongodb://${MONGO_USERNAME}:${encodeURIComponent(
  MONGO_PASSWORD
)}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`;

export const MONGO_OPTION: ConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};
