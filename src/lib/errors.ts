export type ErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "BAD_REQUEST"
  | "INTERNAL_SERVER_ERROR";

export class AppError extends Error {
  status: number;
  code: ErrorCode;
  details?: unknown;

  constructor(code: ErrorCode, message: string, status: number, details?: unknown) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export const errorResponse = (code: ErrorCode, message: string, details?: unknown) => ({
  error: {
    code,
    message,
    details
  }
});
