import { ErrorCodes } from "./ErrorCodes.js";

export const StatusMap = {
  [ErrorCodes.AUTH_INVALID_TOKEN]: 401,
  [ErrorCodes.AUTH_REQUIRED]: 401,

  [ErrorCodes.ACCOUNT_NOT_FOUND]: 404,
  [ErrorCodes.ACCOUNT_INVALID_DATA]: 400,

  [ErrorCodes.PROFILE_NOT_FOUND]: 404,
  [ErrorCodes.PROFILE_LIMIT_REACHED]: 403,
  [ErrorCodes.PROFILE_INVALID_DATA]: 400,
  [ErrorCodes.PROFILE_PRIVATE]: 400,

  [ErrorCodes.CONTACT_NOT_FOUND]: 404,
  [ErrorCodes.CONTACT_ALREADY_SAVED]: 409,
  [ErrorCodes.CONTACT_INVALID_DATA]: 400,

  [ErrorCodes.PUBLIC_PROFILE_NOT_ACCESSIBLE]: 404,

  [ErrorCodes.INVALID_UUID]: 400,
  [ErrorCodes.INVALID_EMAIL]: 400,
  [ErrorCodes.INVALID_PHONE]: 400,

  [ErrorCodes.RATE_LIMITED]: 429,
  [ErrorCodes.VALIDATION_FAILED]: 400,

  [ErrorCodes.INTERNAL_ERROR]: 500,
};
