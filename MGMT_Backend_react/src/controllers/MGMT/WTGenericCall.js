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
  validateServicePayload,
} = require("../../envelope");
const { fail } = require("assert");

const JWT_SECRET = process.env.JWT_SECRET;


const WTGenericCall = async (req, res) => {
  let connection;
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
    const parts = Request1.split("$");
    const partsnew = parts[3].split("~");
    connection = await getConnection();
    //Call Procedure 
    const sql = `
      BEGIN
        admins.aoup_generic_fetch(
          :In_Flag,
          :In_UserId,
          :In_ParamStr1,
          :In_ParamStr2,
          :In_ParamStr3,
          :In_ParamStr4,
          :In_ParamStr5,
          :In_ParamStr6,
          :In_ParamStr7,
          :out_ReturnStr,
          :out_ErrorCode,
          :out_ErrorMsg
        );
      END;
    `;

    const binds = {
      In_Flag:       { dir: oracledb.BIND_IN,  type: oracledb.STRING, val: parts[1] },
      In_UserId:     { dir: oracledb.BIND_IN,  type: oracledb.STRING, val: parts[2] },
      // In_UlbId:      { dir: oracledb.BIND_IN,  type: oracledb.NUMBER, val: Number(partsnew[0]) || 0 },

      In_ParamStr1:  { dir: oracledb.BIND_IN,  type: oracledb.STRING, val: parts[3] },
      In_ParamStr2:  { dir: oracledb.BIND_IN,  type: oracledb.STRING, val: "" },
      In_ParamStr3:  { dir: oracledb.BIND_IN,  type: oracledb.STRING, val: "" },
      In_ParamStr4:  { dir: oracledb.BIND_IN,  type: oracledb.STRING, val: "" },
      In_ParamStr5:  { dir: oracledb.BIND_IN,  type: oracledb.STRING, val: ""},
      In_ParamStr6:  { dir: oracledb.BIND_IN,  type: oracledb.STRING, val: "" },
      In_ParamStr7:  { dir: oracledb.BIND_IN,  type: oracledb.STRING, val: "" },

      out_ReturnStr: { dir: oracledb.BIND_OUT, type: oracledb.CLOB },
      out_ErrorCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      out_ErrorMsg:  { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 4000 }
    };

    const result = await connection.execute(sql, binds, { autoCommit: false });

    // Convert CLOB to string if fetchAsString isn't enabled
    const clobToString = (lob) =>
      new Promise((resolve, reject) => {
        if (!lob) return resolve("");
        if (typeof lob === "string") return resolve(lob);
        let data = "";
        lob.setEncoding("utf8");
        lob.on("data", (chunk) => (data += chunk));
        lob.on("end", () => resolve(data));
        lob.on("error", reject);
      });

    const returnStr = await clobToString(result.outBinds.out_ReturnStr);

    // Try parse JSON if the proc returns JSON text
    let parsed = null;
    try { parsed = JSON.parse(returnStr); } catch (_) {}

    
    // if (result.outBinds.out_ErrorCode !=9999) {
    //   return res.status(200).json({
    //     errorcode: result.outBinds.out_ErrorCode,
    //     Success: false,
    //     userConfig: {},
    //     data: "Unable to Proceed in API", // keep for debugging; remove in prod
    //   });
    // }
    // const v = validateServicePayload(parsed);
    //console.log("Decrypted data:", data);
    //console.log("Decrypted response:", v);
//console.log("v:",v);
    // if (!v.ok) {
    //   return res.status(200).json({
    //     errorcode: 1001,
    //     Success: false,
    //     userConfig: {},
    //     data: "Unable to Proceed in API", // keep for debugging; remove in prod
    //   });
    // }

    return res.status(200).json({
      errorcode: result.outBinds.out_ErrorCode,
      Success: true,
      userConfig: {}, // fill if you fetch it above
      data: parsed !== null ? parsed : returnStr
    });
  } catch (err) {
    console.error("GenericCall API error:", err?.response?.data || err.message);
    return res.status(500).json({
      message: "Server error",
      error: err?.response?.data || err.message,
    });
  }
  finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing Oracle connection:", closeErr);
      }
    }}
};

module.exports = { WTGenericCall };
