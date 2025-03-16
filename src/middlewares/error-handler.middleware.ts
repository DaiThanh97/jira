import { Request, Response } from "express";
import { HttpStatus } from "../configs/http.config";
import { AppError } from "../utils/error";

export const errorHandler = (error, req: Request, res: Response, next) => {
  console.error(`Error Occured on PATH: ${req.path}`, error);

  if (error instanceof SyntaxError) {
    res.status(HttpStatus.BAD_REQUEST).json({
      message: "Invalid JSON format.",
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
    });
    return;
  }

  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    message: "Internal Server Error",
    error: error?.message || "Unknown error occurred",
  });
};
