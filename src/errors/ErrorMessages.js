import { ErrorCodes } from './ErrorCodes.js';

export const ErrorMessages = {
  [ErrorCodes.AUTH_INVALID_TOKEN]: "Invalid authentication token",
  [ErrorCodes.AUTH_REQUIRED]: "Authentication required",

  [ErrorCodes.ACCOUNT_NOT_FOUND]: "Account not found",
  [ErrorCodes.ACCOUNT_INVALID_DATA]: "Invalid account data",

  [ErrorCodes.PROFILE_NOT_FOUND]: "Profile not found",
  [ErrorCodes.PROFILE_LIMIT_REACHED]: "Profile limit reached",
  [ErrorCodes.PROFILE_INVALID_DATA]: "Invalid profile data",
  [ErrorCodes.PROFILE_PRIVATE]: "Profile is private and cannot be shared",

  [ErrorCodes.CONTACT_NOT_FOUND]: "Contact not found",
  [ErrorCodes.CONTACT_ALREADY_SAVED]: "Contact already saved",
  [ErrorCodes.CONTACT_INVALID_DATA]: "Invalid contact data",

  [ErrorCodes.PUBLIC_PROFILE_NOT_ACCESSIBLE]: "Profile not accessible",

  [ErrorCodes.INVALID_UUID]: "Invalid UUID format",
  [ErrorCodes.INVALID_EMAIL]: "Invalid email format",
  [ErrorCodes.INVALID_PHONE]: "Invalid phone number format",

  [ErrorCodes.RATE_LIMITED]: "Rate limit exceeded",
  [ErrorCodes.VALIDATION_FAILED]: "Invalid request data",

  [ErrorCodes.INTERNAL_ERROR]: "Internal server error",
};
