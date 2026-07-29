//const { encryptToHex } = require('./crypto-aes');
const { encryptToHex, decryptFromHex } = require('./crypto-aes');
const ENC_KEY = process.env.ENC_KEY || 'YourExactKeyValueFromDotNet';

function buildLoginInner({ user_id, password, macAddress, ipAddress, hostName, source }) {
  return {
    jsonData: [
      { user_id, password, macAddress, ipAddress, hostName, source }
    ]
  };
}

function buildInnerBody({ Request1, Request2, Request3, Request4, Request5, Request6, Request7 }) {
  return {
    jsonData: [
      { Request1, Request2, Request3, Request4, Request5, Request6, Request7 }
    ]
  };
}

function encryptJsonData(innerObj) {
  // innerObj is a single object that belongs inside jsonData[0]
  const inner = { jsonData: [ innerObj ] };
  const encr_request = encryptToHex(JSON.stringify(inner), ENC_KEY);
  return { jsonData: [ { encr_request } ] };
}

function unwrapEncrypted(body) {
  // Handles both { encr_Response: "<HEX>" } and { jsonData: [ { encr_response/encr_Response: "<HEX>" } ] }
  const hex =
    body?.encr_Response ||
    body?.encr_response ||
    body?.jsonData?.[0]?.encr_Response ||
    body?.jsonData?.[0]?.encr_response;

  if (!hex) return body; // not encrypted (or unexpected shape) → return as-is

  const decrypted = decryptFromHex(hex, ENC_KEY); // <-- your AES-256-CBC, IV=0 method
  try {
    return JSON.parse(decrypted); // most servers return JSON string inside
  } catch {
    return { raw: decrypted };    // fallback if it’s plain text
  }
}

function validateServicePayload(payload) {
  if (!payload || typeof payload !== "object") {
    return { ok: false, message: "Invalid payload type" };
  }

  // Example minimal validation — customize as per your structure
  if (!payload.jsonData || !Array.isArray(payload.jsonData)) {
    return { ok: false, message: "Missing jsonData array" };
  }

  return { ok: true };
}

module.exports = { buildLoginInner, buildInnerBody, encryptJsonData, ENC_KEY, unwrapEncrypted,validateServicePayload };
