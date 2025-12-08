// shared/src/auth/expressAuth.js
import { AppError } from "../errors/AppError.js";
import { ErrorCodes } from "../errors/ErrorCodes.js";
import { verifyToken } from "../supabase/verifyToken.js";

export const expressAuth = () => {
  return async (req, res, next) => {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return next(new AppError(ErrorCodes.AUTH_REQUIRED));
    }

    try {
      req.user = await verifyToken(token);
      next();
    } catch (e) {
      next(new AppError(ErrorCodes.AUTH_INVALID_TOKEN));
    }
  };
};
