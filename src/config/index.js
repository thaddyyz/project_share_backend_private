export const config = {
  supabase: {
    url: process.env.SUPABASE_URL,
    serviceKey: process.env.SUPABASE_SERVICE_KEY,
  },
  encryption: {
    key: process.env.ENCRYPTION_KEY,
  }
};

// Validation - will throw error if used without proper env vars
export const validateConfig = () => {
  if (!config.supabase.url || !config.supabase.serviceKey) {
    throw new Error('Missing required environment variables: SUPABASE_URL and SUPABASE_SERVICE_KEY');
  }
  if (!config.encryption.key) {
    throw new Error('Missing required environment variable: ENCRYPTION_KEY');
  }
};