// Core exports
export { authenticateToken, expressAuthToken } from './middleware/auth.js';
export { rateLimit, expressRateLimit } from './middleware/rateLimit.js';
export { encrypt, decrypt, safeDecrypt } from './utils/encryption.js'; // All encryption together
export { default as supabase } from './db/supabaseClient.js';

// Error handling exports
export { 
  errorHandler, 
  withErrorHandling, 
  AppError 
} from './middleware/errorHandler.js';

// Validation exports (no encryption here)
export { 
  validateRequiredFields,
  validateEmail, 
  validatePhone,
  validateProfileData,
  validateAccountData,
  validateUUID
} from './utils/validation.js';

// Config export
export { config } from './config/index.js';

export { SUBSCRIPTION_LIMITS } from './constants/subscriptions.js';