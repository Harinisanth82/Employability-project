import { Response } from "express";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  code?: string;
  error?: string;
}

export function sendSuccess<T>(res: Response, data?: T, message?: string, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 400,
  code = "BAD_REQUEST",
  errorDetails?: any
) {
  return res.status(statusCode).json({
    success: false,
    message,
    code,
    error: errorDetails ? String(errorDetails) : undefined,
  });
}
