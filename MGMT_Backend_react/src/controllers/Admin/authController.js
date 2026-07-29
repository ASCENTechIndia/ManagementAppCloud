const oracledb = require("oracledb");
const { getConnection } = require("../../../src/config/database");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken"); // Import JWT
const encrypt = require("../../middleware/authMiddleware");
const axios = require('axios');
const path = require('path');
const jwksRsa = require("jwks-rsa");
const { expressjwt: jwtMiddleware } = require("express-jwt");
const { encryptToHex, decryptFromHex } = require('../../crypto-aes');
const { buildLoginInner, encryptJsonData, ENC_KEY,unwrapEncrypted } = require('../../envelope');

const JWT_SECRET = process.env.JWT_SECRET;

const LOGIN_URL = process.env.LOGIN_URL || 'http://nagarkaryavaliuat.com/ANCL_CloudWebService/Service.svc/Login';




const {
  AUTH0_DOMAIN,
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_AUDIENCE, AUTH0_REALM
} = process.env;

const getWardID = async (zoneID) => {
  let connection;
  try {
    connection = await getConnection();
    const query =
      "SELECT num_zone_wardid FROM PROP.aoms_zone_mas WHERE num_zone_id = :zoneID";
    const result = await connection.execute(query, [zoneID], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    if (result.rows.length > 0) {
      return result.rows[0].NUM_ZONE_WARDID;
    }
    return null;
  } catch (error) {
    console.error("Error fetching Ward ID:", error);
    return null;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

// const login = async (req, res) => { 
//   const { in_UserId, in_password } = req.body;
//   console.log(req.body);
//   try {
//     const connection = await getConnection();
//     const password_final = encrypt.encryptPassword(in_password);
//     console.log("Sending Parameters to Oracle:", { in_UserId, password_final });

//     const bindParams = {
//       IN_USERID: in_UserId,
//       IN_PASSWORD: password_final,
//       IN_MACADDR: "00-14-22-01-23-45",
//       IN_IPADDR: "192.168.1.100",
//       IN_HOSTNAME: "localhost",
//       IN_SOURCE: "WEB",
//       IN_DEPTID: "683",

//       OUT_USERNAME: {
//         dir: oracledb.BIND_OUT,
//         type: oracledb.STRING,
//         maxSize: 255,
//       },
//       OUT_USERID: {
//         dir: oracledb.BIND_OUT,
//         type: oracledb.STRING,
//         maxSize: 255,
//       },
//       OUT_LASTLOGIN: {
//         dir: oracledb.BIND_OUT,
//         type: oracledb.STRING,
//         maxSize: 255,
//       },
//       OUT_LASTLOGOUT: {
//         dir: oracledb.BIND_OUT,
//         type: oracledb.STRING,
//         maxSize: 255,
//       },
//       OUT_CORPORATION: {
//         dir: oracledb.BIND_OUT,
//         type: oracledb.STRING,
//         maxSize: 255,
//       },
//       OUT_CORPORATIONADDRESS: {
//         dir: oracledb.BIND_OUT,
//         type: oracledb.STRING,
//         maxSize: 255,
//       },
//       OUT_RECEIPTOFFICENAME: {
//         dir: oracledb.BIND_OUT,
//         type: oracledb.STRING,
//         maxSize: 255,
//       },
//       OUT_CHALANOFFICENAME: {
//         dir: oracledb.BIND_OUT,
//         type: oracledb.STRING,
//         maxSize: 255,
//       },
//       OUT_PRABHAGNAME: {
//         dir: oracledb.BIND_OUT,
//         type: oracledb.STRING,
//         maxSize: 255,
//       },
//       OUT_PRABHAGID: {
//         dir: oracledb.BIND_OUT,
//         type: oracledb.STRING,
//         maxSize: 255,
//       },
//       OUT_DESIGID: {
//         dir: oracledb.BIND_OUT,
//         type: oracledb.STRING,
//         maxSize: 255,
//       },
//       OUT_USERTYPE: {
//         dir: oracledb.BIND_OUT,
//         type: oracledb.STRING,
//         maxSize: 255,
//       },
//       OUT_COLLECTIONCENTER: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
//       OUT_MOBILENO: {
//         dir: oracledb.BIND_OUT,
//         type: oracledb.STRING,
//         maxSize: 255,
//       },
//       OUT_OTPVALIDATE: {
//         dir: oracledb.BIND_OUT,
//         type: oracledb.STRING,
//         maxSize: 255,
//       },
//       OUT_ERRORCODE: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
//       OUT_ERRORMSG: {
//         dir: oracledb.BIND_OUT,
//         type: oracledb.STRING,
//         maxSize: 255,
//       },
//       OUT_ORGID: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
//       OUT_FORCEFULLPASSCHAGE: {
//         dir: oracledb.BIND_OUT,
//         type: oracledb.STRING,
//         maxSize: 255,
//       },
//     };

//     console.log("Calling Oracle Stored Procedure...");
//     const result = await connection.execute(
//       `BEGIN admins.aoma_login_fetch(
//         :IN_USERID, :IN_PASSWORD, :IN_MACADDR, :IN_IPADDR, :IN_HOSTNAME, :IN_SOURCE, :IN_DEPTID,
//         :OUT_USERNAME, :OUT_USERID, :OUT_LASTLOGIN, :OUT_LASTLOGOUT, :OUT_CORPORATION, :OUT_CORPORATIONADDRESS,
//         :OUT_RECEIPTOFFICENAME, :OUT_CHALANOFFICENAME, :OUT_PRABHAGNAME, :OUT_PRABHAGID, :OUT_DESIGID, :OUT_USERTYPE,
//         :OUT_COLLECTIONCENTER, :OUT_MOBILENO, :OUT_OTPVALIDATE, :OUT_ERRORCODE, :OUT_ERRORMSG, :OUT_ORGID, :OUT_FORCEFULLPASSCHAGE
//       ); END;`,
//       bindParams
//     );

//     await connection.close();
//     console.log("Oracle Response:", result.outBinds);

//     if (result.outBinds.OUT_ERRORCODE !== 9999) {
//       return res.status(401).json({ message: result.outBinds.OUT_ERRORMSG });
//     }

//     // Fetch the Ward ID
//     const wardID = await getWardID(result.outBinds.OUT_PRABHAGID);
//     const userConfig = await fetchUserConfig();


//     const userData = {
//       Out_UserName: result.outBinds.OUT_USERNAME,
//       userId: result.outBinds.OUT_USERID,
//       Out_LastLogin: result.outBinds.OUT_LASTLOGIN,
//       Out_LastLogOut: result.outBinds.OUT_LASTLOGOUT,
//       corporation: result.outBinds.OUT_CORPORATION,
//       corporationAddress: result.outBinds.OUT_CORPORATIONADDRESS,
//       receiptOfficeName: result.outBinds.OUT_RECEIPTOFFICENAME,
//       chalanOfficeName: result.outBinds.OUT_CHALANOFFICENAME,
//       prabhagName: result.outBinds.OUT_PRABHAGNAME,
//       prabhagID: wardID,
//       acccounttype: 683,
//       userType: result.outBinds.OUT_USERTYPE,
//       Out_Collectioncenter: result.outBinds.OUT_COLLECTIONCENTER, // Assign Ward ID to Collection Center
//       mobileNo: result.outBinds.OUT_MOBILENO,
//       otpValidate: result.outBinds.OUT_OTPVALIDATE,
//       errorCode: result.outBinds.OUT_ERRORCODE,
//       errorMsg: result.outBinds.OUT_ERRORMSG,
//       out_OrgId: result.outBinds.OUT_ORGID,
//       forceFullPassChange: result.outBinds.OUT_FORCEFULLPASSCHAGE,
//     };

//     console.log("Storing Data in LocalStorage:", {
//       ulbId: userData.out_OrgId,
//       deptId: bindParams.IN_DEPTID,
//       userId: userData.userId,
//       prabhagName: userData.prabhagName,
//       callcenterId: userData.Out_Collectioncenter, // Corrected callcenter ID
//     });

//     // Local storage data
//     const localStorageData = {
//       ulbId: userData.out_OrgId,
//       deptId: bindParams.IN_DEPTID,
//       userId: userData.userId,
//       prabhagName: userData.prabhagName,
//       callcenterId: userData.Out_Collectioncenter, // Ensure callcenterId is stored
//     };

//     // Generate JWT Token
//     const token = jwt.sign(
//       {
//         userId: userData.userId,
//         userName: userData.Out_UserName,
//         userType: userData.userType,
//         orgId: userData.out_OrgId,
//       },
//       JWT_SECRET,
//       { expiresIn: "1h" } // Token expires in 1 hour
//     );

//     //console.log("JWT Token Generated:", token);
//     console.log("Login Success")
//     // Send response with token and data for localStorage
//     return res.status(200).json({
//       token,
//       user: userData,
//       userConfig, 
//       localStorageData, // Send this so frontend can store it
//     });
//   } catch (err) {
//     console.error("Server Error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// Add inside your login function, after successful login but before sending response

// Fetch User Config
const fetchUserConfig = async () => {
  let connection;
  try {
    connection = await getConnection();
    const query = `
      SELECT 
        uc.num_opdconfig_id,
        uc.num_opdconfig_opdid,
        uc.var_opdconfig_flag,
        uc.num_opdconfig_ulbid,
        om.var_opd_name,
        om.var_opd_code
      FROM aopd_opd_config uc join aopd_opd_mas om on uc.num_opdconfig_opdid=om.num_opd_id and om.var_opd_flag='Y'
      WHERE uc.var_opdconfig_flag='Y'
    `;
    const result = await connection.execute(
      query,
      {},
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching user config:", error);
    return [];
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

const authLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) return res.status(400).json({ error: "Username and password required" });

  try {
    const response = await axios.post(`https://${AUTH0_DOMAIN}/oauth/token`, {
      grant_type: "http://auth0.com/oauth/grant-type/password-realm",
      username,
      password,
      realm: AUTH0_REALM,
      client_id: AUTH0_CLIENT_ID,
      client_secret: AUTH0_CLIENT_SECRET,
      audience: AUTH0_AUDIENCE,
      scope: "openid profile email offline_access"
    });

    const { access_token, refresh_token } = response.data;

    const connection = await getConnection();
    const password_final = encrypt.encryptPassword(password);
    console.log("Sending Parameters to Oracle:", { username, password_final });

    const bindParams = {
      IN_USERID: username,
      IN_PASSWORD: password_final,
      IN_MACADDR: "00-14-22-01-23-45",
      IN_IPADDR: "192.168.1.100",
      IN_HOSTNAME: "localhost",
      IN_SOURCE: "WEB",
      IN_DEPTID: "",

      OUT_USERNAME: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_USERID: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_LASTLOGIN: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_LASTLOGOUT: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_CORPORATION: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_CORPORATIONADDRESS: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_RECEIPTOFFICENAME: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_CHALANOFFICENAME: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_PRABHAGNAME: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_PRABHAGID: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_DESIGID: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_USERTYPE: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_COLLECTIONCENTER: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      OUT_MOBILENO: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_OTPVALIDATE: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_ERRORCODE: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      OUT_ERRORMSG: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_ORGID: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      OUT_FORCEFULLPASSCHAGE: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
    };

    console.log("Calling Oracle Stored Procedure...");
    const result = await connection.execute(
      `BEGIN admins.aoma_login_fetch(
        :IN_USERID, :IN_PASSWORD, :IN_MACADDR, :IN_IPADDR, :IN_HOSTNAME, :IN_SOURCE, :IN_DEPTID,
        :OUT_USERNAME, :OUT_USERID, :OUT_LASTLOGIN, :OUT_LASTLOGOUT, :OUT_CORPORATION, :OUT_CORPORATIONADDRESS,
        :OUT_RECEIPTOFFICENAME, :OUT_CHALANOFFICENAME, :OUT_PRABHAGNAME, :OUT_PRABHAGID, :OUT_DESIGID, :OUT_USERTYPE,
        :OUT_COLLECTIONCENTER, :OUT_MOBILENO, :OUT_OTPVALIDATE, :OUT_ERRORCODE, :OUT_ERRORMSG, :OUT_ORGID, :OUT_FORCEFULLPASSCHAGE
      ); END;`,
      bindParams
    );

    await connection.close();
    console.log("Oracle Response:", result.outBinds);

    if (result.outBinds.OUT_ERRORCODE !== 9999) {
      return res.status(401).json({ message: result.outBinds.OUT_ERRORMSG });
    }

    // Fetch the Ward ID
    const wardID = await getWardID(result.outBinds.OUT_PRABHAGID);
    const userConfig = await fetchUserConfig();

    const userData = {
      Out_UserName: result.outBinds.OUT_USERNAME,
      userId: result.outBinds.OUT_USERID,
      Out_LastLogin: result.outBinds.OUT_LASTLOGIN,
      Out_LastLogOut: result.outBinds.OUT_LASTLOGOUT,
      corporation: result.outBinds.OUT_CORPORATION,
      corporationAddress: result.outBinds.OUT_CORPORATIONADDRESS,
      receiptOfficeName: result.outBinds.OUT_RECEIPTOFFICENAME,
      chalanOfficeName: result.outBinds.OUT_CHALANOFFICENAME,
      prabhagName: result.outBinds.OUT_PRABHAGNAME,
      prabhagID: wardID,//result.outBinds.OUT_PRABHAGID,
      acccounttype: 683,
      userType: result.outBinds.OUT_USERTYPE,
      Out_Collectioncenter: result.outBinds.OUT_COLLECTIONCENTER, // Assign Ward ID to Collection Center
      mobileNo: result.outBinds.OUT_MOBILENO,
      otpValidate: result.outBinds.OUT_OTPVALIDATE,
      errorCode: result.outBinds.OUT_ERRORCODE,
      errorMsg: result.outBinds.OUT_ERRORMSG,
      out_OrgId: result.outBinds.OUT_ORGID,
      forceFullPassChange: result.outBinds.OUT_FORCEFULLPASSCHAGE,
    };

    console.log("Storing Data in LocalStorage:", {
      ulbId: userData.out_OrgId,
      deptId: bindParams.IN_DEPTID,
      userId: userData.userId,
      prabhagName: userData.prabhagName,
      callcenterId: userData.Out_Collectioncenter, // Corrected callcenter ID
    });

    // Local storage data
    const localStorageData = {
      ulbId: userData.out_OrgId,
      deptId: bindParams.IN_DEPTID,
      userId: userData.userId,
      prabhagName: userData.prabhagName,
      callcenterId: userData.Out_Collectioncenter, // Ensure callcenterId is stored
    };

    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      domain: ".nagarkaryavalinewuat.com",
      maxAge: 15 * 60 * 1000
    });

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      domain: ".nagarkaryavalinewuat.com",
      maxAge: 30 * 24 * 60 * 60 * 1000
    });
 const token = jwt.sign(
      {
        userId: userData.userId,
        userName: userData.Out_UserName,
        userType: userData.userType,
        orgId: userData.out_OrgId,
      },
      JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );
      return res.status(200).json({
      message: "Logged in successfully",
        token,
        user: userData,
         userConfig, 
        localStorageData
      });
   
  } catch (err) {
    console.error("Auth0 login error:", err.response?.data || err.message);
    res.status(401).json({
  error: "Login failed",
  details: err.response?.data || err.message || err
});

  }
};

// ⛩️ Middleware: verify access_token from cookies
const checkJwt = jwtMiddleware({
  secret: jwksRsa.expressJwtSecret({
    jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5
  }),
  audience: AUTH0_AUDIENCE,
  issuer: `https://${AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
  getToken: req => req.cookies.access_token
});

// ✅ GET /api/me — return decoded Auth0 user info
const getMe = (req, res) => {
  res.json({ user: req.auth });
};

// 🔁 POST /api/refresh — refresh access_token using refresh_token
const refreshToken = async (req, res) => {
  const refresh_token = req.cookies.refresh_token;
  if (!refresh_token) return res.status(401).json({ error: "No refresh token" });

  try {
    const response = await axios.post(`https://${AUTH0_DOMAIN}/oauth/token`, {
      grant_type: "refresh_token",
      client_id: AUTH0_CLIENT_ID,
      client_secret: AUTH0_CLIENT_SECRET,
      refresh_token
    });

    res.cookie("access_token", response.data.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      domain: ".nagarkaryavalinewuat.com",
      maxAge: 15 * 60 * 1000
    });

    res.json({ message: "Access token refreshed" });
  } catch (err) {
    console.error("Token refresh failed:", err.response?.data || err.message);
    res.status(401).json({ error: "Refresh token failed" });
  }
};

// 🚪 POST /api/logout — clear cookies
const logout = (req, res) => {
  res.clearCookie("access_token", { domain: ".nagarkaryavalinewuat.com" });
  res.clearCookie("refresh_token", { domain: ".nagarkaryavalinewuat.com" });
  res.status(200).json({ message: "Logged out" });
};

const login = async (req, res) => {
  try {
    const {
      in_UserId,
      in_password,
      IN_MACADDR,
      IN_IPADDR,
      IN_HOSTNAME,
      IN_SOURCE
    } = req.body;

    if (!in_UserId || !in_password) {
      return res.status(400).json({ message: 'Missing in_UserId or in_password' });
    }

    // 1) Build inner JSON exactly as WCF expects
    const inner = buildLoginInner({
      user_id:   in_UserId,
      password:  in_password,
      macAddress: IN_MACADDR || '00-14-22-01-23-45',
      ipAddress:  IN_IPADDR  || '127.0.0.1',
      hostName:   IN_HOSTNAME|| 'localhost',
      source:     IN_SOURCE  || 'WEB'
    });

    // 2) Encrypt to outer payload { jsonData: [{ encr_request: HEX }] }
    const payload = encryptJsonData(inner.jsonData[0]);

    // 3) Call WCF API
    const apiRes = await axios.post(LOGIN_URL, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 20000
    });

    const data = unwrapEncrypted(apiRes.data);

    // 5) Check success (you use 9999 as success)
    // if (data.ErrorCode !== 9999) {
    //   return res.status(401).json({ message: data.ErrorMessage || 'Login failed' });
    // }

    // If you still need to fetch wardID/userConfig from your DB/services, do it here:
    // const wardID = await getWardID(data.user.prabhagID);
    // data.user.prabhagID = wardID;
    // const userConfig = await fetchUserConfig();

    // 6) JWT
    const token = jwt.sign(
      {
        userId:   inner.jsonData[0].user_id,
        userName: data.UserName,
        userType: 1, // set appropriately
        orgId:    data.OrgId,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      token,
      userId: inner.jsonData[0].user_id,
      userConfig: {}, // fill if you fetch it above
      data,
      raw: data.raw // keep for debugging; remove in prod
    });

  } catch (err) {
    console.error('Login API error:', err?.response?.data || err.message);
    return res.status(500).json({
      message: 'Server error',
      error: err?.response?.data || err.message
    });
  }
};


module.exports = { login, getWardID, authLogin,
   checkJwt, getMe, refreshToken, logout  };
