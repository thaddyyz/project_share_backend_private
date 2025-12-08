// shared/src/middleware/serverlessRateLimit.js
import { AppError } from "../errors/AppError.js";
import { ErrorCodes } from "../errors/ErrorCodes.js";

const rateLimitMap = new Map();

export const serverlessRateLimit = async (identifier, windowMs = 5000, maxRequests = 1) => {
  const now = Date.now();
  const windowStart = now - windowMs;

  if (!rateLimitMap.has(identifier)) {
    rateLimitMap.set(identifier, []);
  }

  const requests = rateLimitMap.get(identifier).filter(t => t > windowStart);

  if (requests.length >= maxRequests) {
    const retryAfter = Math.ceil((requests[0] + windowMs - now) / 1000);
    const err = new AppError(ErrorCodes.RATE_LIMITED);
    err.retryAfter = retryAfter;
    throw err;
  }

  rateLimitMap.get(identifier).push(now);
};

// // Simple in-memory rate limiting (for serverless - will reset on cold starts)
// const rateLimitMap = new Map();

// export const rateLimit = async (identifier, windowMs = 5000, maxRequests = 1) => {
//   const now = Date.now();
//   const windowStart = now - windowMs;

//   if (!rateLimitMap.has(identifier)) {
//     rateLimitMap.set(identifier, []);
//   }

//   const requests = rateLimitMap.get(identifier);
//   const recentRequests = requests.filter(time => time > windowStart);
  
//   if (recentRequests.length >= maxRequests) {
//     const retryAfter = Math.ceil((recentRequests[0] + windowMs - now) / 1000);
//     throw new Error(`Rate limit exceeded. Try again in ${retryAfter} seconds.`);
//   }

//   recentRequests.push(now);
//   rateLimitMap.set(identifier, recentRequests);
  
//   // Cleanup old entries periodically (simple approach)
//   if (Math.random() < 0.1) { // 10% chance to cleanup
//     for (const [key, times] of rateLimitMap.entries()) {
//       const validTimes = times.filter(time => time > now - 60000); // Keep only last minute
//       if (validTimes.length === 0) {
//         rateLimitMap.delete(key);
//       } else {
//         rateLimitMap.set(key, validTimes);
//       }
//     }
//   }
// };

// export const expressRateLimit = (windowMs = 5000, maxRequests = 1) => {
//   return (req, res, next) => {
//     try {
//       const identifier = req.user?.id || req.ip;
//       const now = Date.now();

//       if (!global.rateLimitMap) global.rateLimitMap = new Map();
//       if (!global.rateLimitMap.has(identifier)) {
//         global.rateLimitMap.set(identifier, []);
//       }

//       const requests = global.rateLimitMap.get(identifier);
//       const recentRequests = requests.filter(time => time > now - windowMs);
      
//       if (recentRequests.length >= maxRequests) {
//         const retryAfter = Math.ceil((recentRequests[0] + windowMs - now) / 1000);
//         return res.status(429).json({ 
//           error: `Rate limit exceeded. Try again in ${retryAfter} seconds.` 
//         });
//       }

//       recentRequests.push(now);
//       global.rateLimitMap.set(identifier, recentRequests);
//       next();
//     } catch (error) {
//       next(); // Fail open if rate limiting fails
//     }
//   };
// };