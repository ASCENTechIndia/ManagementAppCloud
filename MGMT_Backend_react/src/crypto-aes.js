// crypto-aes.js
const crypto = require('crypto');

/**
 * Make a 32-byte key like C#:
 * - UTF-8 bytes of KeyValue
 * - Truncate or zero-pad to 32 bytes
 */
function makeKey(keyStr) {
  const keyBuf = Buffer.alloc(32, 0); // zero-filled
  const src = Buffer.from(keyStr, 'utf8');
  src.copy(keyBuf, 0, 0, Math.min(src.length, 32));
  return keyBuf;
}

/**
 * AES-256-CBC, PKCS7 (Node uses PKCS#7 padding by default), IV = 16x00
 * Returns UPPERCASE HEX (to match BitConverter.ToString().Replace("-", "")).
 */
function encryptToHex(plainText, keyStr) {
  const key = makeKey(keyStr);
  const iv = Buffer.alloc(16, 0); // 16 zeros
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const enc = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  return enc.toString('hex').toUpperCase();
}

/**
 * Inverse of encryptToHex: input HEX → UTF-8 plain text JSON
 */
function decryptFromHex(hexCipher, keyStr) {
  const key = makeKey(keyStr);
  const iv = Buffer.alloc(16, 0);
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  const encBuf = Buffer.from(hexCipher, 'hex');
  const dec = Buffer.concat([decipher.update(encBuf), decipher.final()]);
  return dec.toString('utf8');
}

module.exports = { encryptToHex, decryptFromHex };
