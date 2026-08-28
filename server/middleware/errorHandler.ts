import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error("Unhandled API Error:", err);
  const status = err.status || 500;
  const message = err.message || "Something went wrong on the server. Please try again.";
  const code = err.code || "INTERNAL_SERVER_ERROR";

  res.status(status).json({
    success: false,
    message,
    code,
  });
}
