// import crypto from 'crypto';
// import { config } from '../config/index.js';

// const algorithm = 'aes-256-gcm';
// const ivLength = 12; // Recommended length for GCM

// if (!config.encryption.key) {
//   throw new Error('Missing required environment variable: ENCRYPTION_KEY');
// }

// // Derive a 32-byte key (256 bits) for AES-256
// const key = crypto
//   .createHash('sha256')
//   .update(String(config.encryption.key))
//   .digest(); // Always returns 32 bytes

// // Encrypts a string (e.g., UUID)
// export const encrypt = (text) => {
//   const iv = crypto.randomBytes(ivLength);
//   const cipher = crypto.createCipheriv(algorithm, key, iv);

//   const encrypted = Buffer.concat([
//     cipher.update(text, 'utf8'),
//     cipher.final()
//   ]);

//   const authTag = cipher.getAuthTag();

//   const payload = {
//     iv: iv.toString('hex'),
//     encrypted: encrypted.toString('hex'),
//     authTag: authTag.toString('hex'),
//   };

//   return Buffer.from(JSON.stringify(payload)).toString('base64');
// };

// // Decrypts a previously encrypted string
// export const decrypt = (encodedData) => {
//   const { iv, encrypted, authTag } = JSON.parse(
//     Buffer.from(encodedData, 'base64').toString()
//   );

//   const decipher = crypto.createDecipheriv(
//     algorithm,
//     key,
//     Buffer.from(iv, 'hex')
//   );
//   decipher.setAuthTag(Buffer.from(authTag, 'hex'));

//   const decrypted = Buffer.concat([
//     decipher.update(Buffer.from(encrypted, 'hex')),
//     decipher.final()
//   ]);

//   return decrypted.toString('utf8');
// };

// // Safe decrypt that falls back to raw UUID if needed
// export const safeDecrypt = (encodedData) => {
//   if (!encodedData || typeof encodedData !== 'string') {
//     throw new Error('Invalid encoded data');
//   }

//   // UUID v4 regex check
//   const uuidRegex =
//     /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

//   if (uuidRegex.test(encodedData)) {
//     return encodedData; // Already a valid UUID, return as-is
//   }

//   // Otherwise, attempt decryption and validate output
//   const decrypted = decrypt(encodedData);

//   if (!uuidRegex.test(decrypted)) {
//     throw new Error('Decrypted value is not a valid UUID v4');
//   }

//   return decrypted;
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

/** Convert base64 → URL-safe base64 */
const base64UrlEncode = (buffer) =>
  buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

/** Convert URL-safe base64 → normal base64 */
const base64UrlDecode = (str) => {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  // add padding if missing
  while (base64.length % 4 !== 0) base64 += "=";
  return Buffer.from(base64, "base64");
};

// Encrypts a string (e.g., UUID)
// export const encrypt = (text) => {
//   const iv = crypto.randomBytes(ivLength);
//   const cipher = crypto.createCipheriv(algorithm, key, iv);

//   const encrypted = Buffer.concat([
//     cipher.update(text, 'utf8'),
//     cipher.final()
//   ]);

//   const authTag = cipher.getAuthTag();

//   const payload = {
//     iv: iv.toString('hex'),
//     encrypted: encrypted.toString('hex'),
//     authTag: authTag.toString('hex'),
//   };

//   return Buffer.from(JSON.stringify(payload)).toString('base64');
// };

// //shortend ourput encryption by not converting to hex
// export const encrypt = (text) => {
//   const iv = crypto.randomBytes(ivLength); // 12 bytes
//   const cipher = crypto.createCipheriv(algorithm, key, iv);

//   const ciphertext = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
//   const authTag = cipher.getAuthTag();

//   // Combine all binary data:
//   // [iv(12) | authTag(16) | ciphertext(n)]
//   const combined = Buffer.concat([iv, authTag, ciphertext]);

//   return combined.toString("base64"); // small, URL embed-friendly
// };

/** Encrypt UUID → compact URL-safe base64 */
export const encrypt = (text) => {
  const iv = crypto.randomBytes(ivLength); // 12 bytes
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  const ciphertext = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag(); // 16 bytes

  // Combine raw binary buffer:
  // [ IV(12) | AuthTag(16) | Ciphertext(n) ]
  const full = Buffer.concat([iv, authTag, ciphertext]);

  return base64UrlEncode(full);
};

/** Decrypt URL-safe token back to UUID */
export const decrypt = (token) => {
  const data = base64UrlDecode(token);

  const iv = data.subarray(0, 12);
  const authTag = data.subarray(12, 28);
  const ciphertext = data.subarray(28);

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
};

// //Shorteded output decrypt function
// export const decrypt = (encoded) => {
//   const data = Buffer.from(encoded, "base64");

//   const iv = data.subarray(0, 12);
//   const authTag = data.subarray(12, 28);
//   const ciphertext = data.subarray(28);

//   const decipher = crypto.createDecipheriv(algorithm, key, iv);
//   decipher.setAuthTag(authTag);

//   const decrypted = Buffer.concat([
//     decipher.update(ciphertext),
//     decipher.final(),
//   ]);

//   return decrypted.toString("utf8");
// };

// Decrypts a previously encrypted string
// export const decrypt = (encodedData) => {
//   const { iv, encrypted, authTag } = JSON.parse(
//     Buffer.from(encodedData, 'base64').toString()
//   );

//   const decipher = crypto.createDecipheriv(
//     algorithm,
//     key,
//     Buffer.from(iv, 'hex')
//   );
//   decipher.setAuthTag(Buffer.from(authTag, 'hex'));

//   const decrypted = Buffer.concat([
//     decipher.update(Buffer.from(encrypted, 'hex')),
//     decipher.final()
//   ]);

//   return decrypted.toString('utf8');
// };

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
