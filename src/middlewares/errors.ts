import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions/root";
export const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("error ai ha");
  res.status(error.statusCode).json({
    message: error.message,
    error: error.errorCode,
    errors: error.errors,
  });
};