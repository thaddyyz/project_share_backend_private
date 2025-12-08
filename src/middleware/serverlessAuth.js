// import { verifyToken } from '../db/supabaseClient.js';

// export const authenticateToken = async (request) => {
//   const authHeader = request.headers.get('authorization');
//   // const authHeader =req.headers.authorization;
//   const token = authHeader?.replace('Bearer ', '');
  
//   if (!token) {
//     throw new Error('Authentication required');
//   }
  
//   return await verifyToken(token);
// };

// export const expressAuthToken = () => {
//   return async (req, res, next) => {
//     try {
//       const token = req.headers.authorization?.replace('Bearer ', '');
//       if (!token) {
//         return res.status(401).json({ error: 'Authentication required' });
//       }

//       const user = await verifyToken(token);
//       req.user = user;
//       next();
//     } catch (error) {
//       console.log('Authentication error:', error);
//       res.status(401).json({ error: 'Invalid token' });
//     }
//   };
// };
// shared/src/auth/serverlessAuth.js
import { AppError } from "../errors/AppError.js";
import { ErrorCodes } from "../errors/ErrorCodes.js";
import { verifyToken } from "../supabase/verifyToken.js";

export const serverlessAuth = async (request) => {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    throw new AppError(ErrorCodes.AUTH_REQUIRED);
  }

  try {
    return await verifyToken(token);
  } catch (e) {
    throw new AppError(ErrorCodes.AUTH_INVALID_TOKEN);
  }
};
