import express, { Response, Request, NextFunction } from "express";
import session, { Store } from "express-session";
import { SESSION_CONFIG } from "./config";
import { register } from "./routes";

export const AppConfig = (store: Store) => {
  const app = express();
  app.use(express.json());
  app.use(
    session({
      ...SESSION_CONFIG,
      store: store
    })
  );

  app.use(register);
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
