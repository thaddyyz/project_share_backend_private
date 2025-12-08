// shared/src/middleware/expressRateLimit.js
import { AppError } from "../errors/AppError.js";
import { ErrorCodes } from "../errors/ErrorCodes.js";

export const expressRateLimit = (windowMs = 5000, maxRequests = 1) => {
  const map = global.rateLimitMap || new Map();
  global.rateLimitMap = map;

  return (req, res, next) => {
    try {
      const identifier = req.user?.id || req.ip;
      const now = Date.now();
      const windowStart = now - windowMs;

      if (!map.has(identifier)) {
        map.set(identifier, []);
      }

      const requests = map.get(identifier).filter(t => t > windowStart);

      if (requests.length >= maxRequests) {
        const retryAfter = Math.ceil((requests[0] + windowMs - now) / 1000);
        const err = new AppError(ErrorCodes.RATE_LIMITED);
        err.retryAfter = retryAfter;
        return next(err);    // let unified expressErrorHandler handle it
      }

      requests.push(now);
      map.set(identifier, requests);
      next();
    } catch (e) {
      next(); // fail open if limiter breaks
    }
  };
};
