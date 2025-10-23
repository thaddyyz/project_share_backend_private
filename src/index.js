// Core exports
export { authenticateToken } from './middleware/auth.js';
export { rateLimit } from './middleware/rateLimit.js';
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