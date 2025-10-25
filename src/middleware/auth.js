import { verifyToken } from '../db/supabaseClient.js';

export const authenticateToken = async (request) => {
  // const authHeader = request.headers.get('authorization');
  const authHeader =req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  return await verifyToken(token);
};

export const expressAuthToken = () => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = await verifyToken(token);
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
};