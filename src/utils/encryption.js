import crypto from 'crypto';
import { config } from '../config/index.js';

const algorithm = 'aes-256-gcm';

if (!config.encryption.key) {
  throw new Error('Missing required environment variable: ENCRYPTION_KEY');
}

const key = Buffer.from(config.encryption.key.padEnd(32, '0').slice(0, 32), 'utf8');

export const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(algorithm, key);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return Buffer.from(
    JSON.stringify({
      iv: iv.toString('hex'),
      encrypted,
      authTag: authTag.toString('hex')
    })
  ).toString('base64');
};

export const decrypt = (encodedData) => {
  const { iv, encrypted, authTag } = JSON.parse(
    Buffer.from(encodedData, 'base64').toString()
  );
  
  const decipher = crypto.createDecipher(algorithm, key);
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};

// Safe decrypt that handles both encrypted data and plain UUIDs
export const safeDecrypt = (encodedData) => {
  if (!encodedData || typeof encodedData !== 'string') {
    throw new Error('Invalid encoded data');
  }

  // Check if it's a valid UUID (not encrypted)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(encodedData)) {
    return encodedData; // It's already a UUID, return as is
  }

  // Otherwise, try to decrypt it
  return decrypt(encodedData);
  //add a check to ensure it complies with uuisd format
};