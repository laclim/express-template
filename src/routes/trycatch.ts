import { RequestHandler, Request, Response, NextFunction } from "express";

export const trycatch = (handler: RequestHandler) => (
  ...args: [Request, Response, NextFunction]
) => handler(...args).catch(args[2]);
