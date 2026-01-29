import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { sendError } from "../helpers/response.helper";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return sendError(res, err.statusCode, err.message);
  }

  console.error("Unhandled error:", err);

  return sendError(res, 500, "Internal Server Error");
}
