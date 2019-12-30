import jwt from "jsonwebtoken";
import { Unauthorized } from "../errors";
import { Request, Response, NextFunction } from "express";
export const extractToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, process.env.JWT_SECRET!);
      const decoded = jwt.decode(token, { complete: true });

      req.headers.userId = (decoded as any).payload.userId;

      next();
    } catch (error) {
      throw new Unauthorized();
    }
  } else {
    throw new Unauthorized();
  }
  return null;
};
