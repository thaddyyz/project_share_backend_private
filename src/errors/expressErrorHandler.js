import { ErrorCodes } from "./ErrorCodes.js";
import { ErrorMessages } from "./ErrorMessages.js";
import { StatusMap } from "./statusMap.js";

export const expressErrorHandler = (err, req, res, next) => {
  console.error("Error:", {
    code: err.code,
    message: err.message,
    details: err.details,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  const code = err.code || ErrorCodes.INTERNAL_ERROR;
  const status = StatusMap[code] || 500;
  const message = ErrorMessages[code] || ErrorMessages[ErrorCodes.INTERNAL_ERROR];

  res.status(status).json({
    error: message,   // ← same shape as before
    code,
    ...(err.retryAfter && { retry_after: err.retryAfter }),
    ...(process.env.NODE_ENV !== "production" && {
      details: err.details,
      stack: err.stack,
    }),
  });
};
