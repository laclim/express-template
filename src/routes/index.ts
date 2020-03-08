import express from "express";

import { default as register } from "./register";
import { default as user } from "./user";
import { extractToken } from "./headers";
const routers = express();
routers.use(register);
routers.use(extractToken, user);

export default routers;
