import supabase from './supabaseClient.js';
import { AppError } from '../errors/AppError.js';
import { ErrorCodes } from '../errors/ErrorCodes.js';

export const verifyToken = async (token) => {
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    throw new AppError(ErrorCodes.AUTH_INVALID_TOKEN);
  }

  return user;
};
