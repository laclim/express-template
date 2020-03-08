import express, { Response, Request, NextFunction } from "express";
import routers from "./routes";
import cors from "cors";
import { extractToken } from "./routes/headers";

export const AppConfig = () => {
  const app = express();
  app.use(express.json());

  app.use(cors());
  app.use("/api", routers);

  app.use(function(req, res, next) {
    res.status(404).json({ message: "Not Found" });
  });
  app.use(function(err: any, req: Request, res: Response, next: NextFunction) {
    res
      .status(err.status || 500)
      .send({ message: err.message || "Internal Server Error" });
  });
  return app;
};
