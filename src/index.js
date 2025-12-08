// ===========================
// ERROR SYSTEM (CORE)
// ===========================

export { AppError } from './errors/AppError.js';
export { ErrorCodes } from './errors/ErrorCodes.js';
export { ErrorMessages } from './errors/ErrorMessages.js';
export { StatusMap } from './errors/statusMap.js';
export { errorHandler } from './errors/errorHandler.js';
export { expressErrorHandler } from './errors/expressErrorHandler.js';


// ===========================
// AUTHENTICATION
// ===========================

// Express middleware (attaches req.user)
export { expressAuth } from './middleware/expressAuth.js';

// Serverless/Vercel function auth (returns user)
export { serverlessAuth } from './middleware/serverlessAuth.js';


// ===========================
// RATE LIMITING
// ===========================

// Express middleware
export { expressRateLimit } from './middleware/expressRateLimit.js';

// Serverless helper
export { serverlessRateLimit } from './middleware/serverlessRateLimit.js';


// ===========================
// VALIDATION
// ===========================

export { 
  validateRequiredFields,
  validateEmail,
  validatePhone,
  validateProfileData,
  validateAccountData,
  validateUUID
} from './validation/validation.js';


// ===========================
// ENCRYPTION (sharing/public profile)
// ===========================

export { encrypt, decrypt, safeDecrypt } from './security/encryption.js';


// ===========================
// SUPABASE (shared client + helpers)
// ===========================

export { default as supabase } from './supabase/supabaseClient.js';
export { verifyToken } from './supabase/verifyToken.js';


// ===========================
// CONSTANTS (subscription limits, etc.)
// ===========================

export { SUBSCRIPTION_LIMITS } from './constants/subscriptions.js';

// // Core exports
// export { authenticateToken, expressAuthToken } from './middleware/auth.js';
// export { rateLimit, expressRateLimit } from './middleware/rateLimit.js';
// export { encrypt, decrypt, safeDecrypt } from './utils/encryption.js'; // All encryption together
// export { default as supabase } from './db/supabaseClient.js';

// // Error handling exports
// export { 
//   errorHandler, 
//   withErrorHandling, 
//   AppError 
// } from './middleware/errorHandler.js';

// // Validation exports (no encryption here)
// export { 
//   validateRequiredFields,
//   validateEmail, 
//   validatePhone,
//   validateProfileData,
//   validateAccountData,
//   validateUUID
// } from './validation/validation.js';

// // Config export
// export { config } from './config/index.js';

// export { SUBSCRIPTION_LIMITS } from './constants/subscriptions.js';