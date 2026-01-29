import { ZodSchema } from "zod";//`
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: ZodSchema, property: "body" | "params" | "query" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    schema.parse(req[property]);
    next();
  };
