import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export const verifyToken = async (token) => {
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error) throw new Error('Invalid token');
  return user;
};

export default supabase;