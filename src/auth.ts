import { Request, Response, NextFunction } from "express";

export const login = (req: Request, userId: string) => {
  req.session!.userId = userId;
};

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!!req.session!.userId) return next(Error("You are logged in"));
  next();
};
