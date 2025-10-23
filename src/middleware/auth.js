import { verifyToken } from '../db/supabaseClient.js';

export const authenticateToken = async (request) => {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  return await verifyToken(token);
};