// Simple in-memory rate limiting (for serverless - will reset on cold starts)
const rateLimitMap = new Map();

export const rateLimit = async (identifier, windowMs = 5000, maxRequests = 1) => {
  const now = Date.now();
  const windowStart = now - windowMs;

  if (!rateLimitMap.has(identifier)) {
    rateLimitMap.set(identifier, []);
  }

  const requests = rateLimitMap.get(identifier);
  const recentRequests = requests.filter(time => time > windowStart);
  
  if (recentRequests.length >= maxRequests) {
    const retryAfter = Math.ceil((recentRequests[0] + windowMs - now) / 1000);
    throw new Error(`Rate limit exceeded. Try again in ${retryAfter} seconds.`);
  }

  recentRequests.push(now);
  rateLimitMap.set(identifier, recentRequests);
  
  // Cleanup old entries periodically (simple approach)
  if (Math.random() < 0.1) { // 10% chance to cleanup
    for (const [key, times] of rateLimitMap.entries()) {
      const validTimes = times.filter(time => time > now - 60000); // Keep only last minute
      if (validTimes.length === 0) {
        rateLimitMap.delete(key);
      } else {
        rateLimitMap.set(key, validTimes);
      }
    }
  }
};