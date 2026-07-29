const oracledb = require("oracledb");
const { getConnection } = require("../../../src/config/database");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken"); // Import JWT
const encrypt = require("../../middleware/authMiddleware");
const axios = require("axios");
const path = require("path");
const jwksRsa = require("jwks-rsa");
const { expressjwt: jwtMiddleware } = require("express-jwt");
const { encryptToHex, decryptFromHex } = require("../../crypto-aes");
const {
  buildLoginInner,
  buildInnerBody,
  encryptJsonData,
  ENC_KEY,
  unwrapEncrypted,
} = require("../../envelope");

const JWT_SECRET = process.env.JWT_SECRET;

const GenericCallURL =
  process.env.GenericCall ||
  "http://13.232.73.38/ANCL_CloudWebService/Service.svc/GenericCall";

const GenericCall = async (req, res) => {
  try {
    const {
      Request1,
      Request2,
      Request3,
      Request4,
      Request5,
      Request6,
      Request7,
    } = req.body;

    if (!Request1) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 1) Build inner JSON exactly as WCF expects
    const inner = buildInnerBody({
      Request1: Request1,
      Request2: Request2,
      Request3: Request3,
      Request4: Request4,
      Request5: Request5,
      Request6: Request6,
      Request7: Request7,
    });

    // 2) Encrypt to outer payload { jsonData: [{ encr_request: HEX }] }
    const payload = encryptJsonData(inner.jsonData[0]);
   // console.log("Payload sent to WCF:", payload);
    // 3) Call WCF API
    const apiRes = await axios.post(GenericCallURL, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 20000,
    });

    const data = unwrapEncrypted(apiRes.data);
    //console.log("Response from WCF:", data);
    // 5) Check success (you use 9999 as success)
    // if (data.ErrorCode !== 9999) {
    //   return res.status(401).json({ message: data.ErrorMessage || 'Login failed' });
    // }

    // If you still need to fetch wardID/userConfig from your DB/services, do it here:
    // const wardID = await getWardID(data.user.prabhagID);
    // data.user.prabhagID = wardID;
    // const userConfig = await fetchUserConfig();

    // 6) JWT

    return res.status(200).json({
      errorcode: 9999,
      message: "Success",
      userConfig: {}, // fill if you fetch it above
      data,
      raw: data.raw, // keep for debugging; remove in prod
    });
  } catch (err) {
    console.error("GenericCall API error:", err?.response?.data || err.message);
    return res.status(500).json({
      message: "Server error",
      error: err?.response?.data || err.message,
    });
    
  }
};

module.exports = { GenericCall };
