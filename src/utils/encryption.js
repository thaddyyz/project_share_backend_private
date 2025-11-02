// import crypto from 'crypto';
// import { config } from '../config/index.js';

// const algorithm = 'aes-256-gcm';

// if (!config.encryption.key) {
//   throw new Error('Missing required environment variable: ENCRYPTION_KEY');
// }

// const key = Buffer.from(config.encryption.key.padEnd(32, '0').slice(0, 32), 'utf8');

// export const encrypt = (text) => {
//   const iv = crypto.randomBytes(16);
//   const cipher = crypto.createCipher(algorithm, key);
  
//   let encrypted = cipher.update(text, 'utf8', 'hex');
//   encrypted += cipher.final('hex');
  
//   const authTag = cipher.getAuthTag();
  
//   return Buffer.from(
//     JSON.stringify({
//       iv: iv.toString('hex'),
//       encrypted,
//       authTag: authTag.toString('hex')
//     })
//   ).toString('base64');
// };

// export const decrypt = (encodedData) => {
//   const { iv, encrypted, authTag } = JSON.parse(
//     Buffer.from(encodedData, 'base64').toString()
//   );
  
//   const decipher = crypto.createDecipher(algorithm, key);
//   decipher.setAuthTag(Buffer.from(authTag, 'hex'));
  
//   let decrypted = decipher.update(encrypted, 'hex', 'utf8');
//   decrypted += decipher.final('utf8');
  
//   return decrypted;
// };

// // Safe decrypt that handles both encrypted data and plain UUIDs
// export const safeDecrypt = (encodedData) => {
//   if (!encodedData || typeof encodedData !== 'string') {
//     throw new Error('Invalid encoded data');
//   }

//   // Check if it's a valid UUID (not encrypted)
//   const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
//   if (uuidRegex.test(encodedData)) {
//     return encodedData; // It's already a UUID, return as is
//   }

//   // Otherwise, try to decrypt it
//   return decrypt(encodedData);
//   //add a check to ensure it complies with uuisd format
// };
import crypto from 'crypto';
import { config } from '../config/index.js';

const algorithm = 'aes-256-gcm';
const ivLength = 12; // Recommended length for GCM

if (!config.encryption.key) {
  throw new Error('Missing required environment variable: ENCRYPTION_KEY');
}

// Derive a 32-byte key (256 bits) for AES-256
const key = crypto
  .createHash('sha256')
  .update(String(config.encryption.key))
  .digest(); // Always returns 32 bytes

// Encrypts a string (e.g., UUID)
export const encrypt = (text) => {
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final()
  ]);

  const authTag = cipher.getAuthTag();

  const payload = {
    iv: iv.toString('hex'),
    encrypted: encrypted.toString('hex'),
    authTag: authTag.toString('hex'),
  };

  return Buffer.from(JSON.stringify(payload)).toString('base64');
};

// Decrypts a previously encrypted string
export const decrypt = (encodedData) => {
  const { iv, encrypted, authTag } = JSON.parse(
    Buffer.from(encodedData, 'base64').toString()
  );

  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(iv, 'hex')
  );
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encrypted, 'hex')),
    decipher.final()
  ]);

  return decrypted.toString('utf8');
};

// Safe decrypt that falls back to raw UUID if needed
export const safeDecrypt = (encodedData) => {
  if (!encodedData || typeof encodedData !== 'string') {
    throw new Error('Invalid encoded data');
  }

  // UUID v4 regex check
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (uuidRegex.test(encodedData)) {
    return encodedData; // Already a valid UUID, return as-is
  }

  // Otherwise, attempt decryption and validate output
  const decrypted = decrypt(encodedData);

  if (!uuidRegex.test(decrypted)) {
    throw new Error('Decrypted value is not a valid UUID v4');
  }

  return decrypted;
};
