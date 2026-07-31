// // FrontdoorLogin.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import { useAuth } from "./Context/AuthContext";

// /** Read query from either /welcome?x=... or #/welcome?x=... */
// function getQueryString() {
//   let qs = window.location.search || "";
//   if (!qs && window.location.hash) {
//     const i = window.location.hash.indexOf("?");
//     if (i >= 0) qs = window.location.hash.substring(i);
//   }
//   return qs.startsWith("?") ? qs.slice(1) : qs;
// }
// console.log("FrontdoorLogin loaded"+"");
// async function loginCall({ in_UserId, in_password }, useAuth) {
//   console.log("FrontdoorLogin loginCall", { in_UserId, in_password });

//   let res;
//   // Use a configurable API base so dev/prod environments can differ.
//   // In Vite dev use VITE_API_BASE (set in .env or vite.config proxy). If not set,
//   // fall back to a relative path so the same origin is used (helps with mobile webview).
//   const apiBase = import.meta.env.VITE_API_BASE || '';
//   const loginUrl = apiBase ? `${apiBase.replace(/\/$/, '')}/Login` : '/Login';

//   try {
//     res = await fetch(loginUrl, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       // Keep it simple unless your API actually needs cookies:
//       // credentials: "include",
//       body: JSON.stringify({ in_UserId, in_password }),
//     });
//   } catch (networkErr) {
//     console.error('Network error when calling /Login', networkErr);
//     throw new Error('Network error while calling login.');
//   }

//   console.log("Login response status:", res.status, "ok=", res.ok, "url=", res.url);

//   // Parse JSON once and be robust to different shapes. Some responses use
//   // top-level fields (token, userId) while others include a `result` object.
//   let data = {};

//   // First, attempt to log a preview of the response body for debugging.
//   try {
//     const preview = await res.clone().json().catch(() => null);
//     if (preview) console.log('Login response (clone):', preview);
//   } catch (cloneErr) {
//     console.warn('Could not read cloned response body', cloneErr);
//   }

//   // If the HTTP status is not OK, surface the server error (try JSON then text)
//   if (!res.ok) {
//     let errBody = null;
//     try {
//       errBody = await res.json();
//     } catch (_e) {
//       try {
//         errBody = await res.text();
//       } catch (_t) {
//         errBody = null;
//       }
//     }
//     console.error('Login request failed', { status: res.status, statusText: res.statusText, body: errBody });
//     const errMsg = errBody && (errBody.message || errBody.ErrorMessage || JSON.stringify(errBody)) || `HTTP ${res.status} ${res.statusText}`;
//     throw new Error(errMsg);
//   }

//   try {
//     data = await res.json();
//   } catch (e) {
//     console.warn('Failed to parse JSON response from /Login', e);
//     data = {};
//   }

//   console.log("Login response data:", data);

//   // Normalise: prefer top-level token, else try result/token, else fail.
//   const token = data?.token || data?.result?.token;
//   const errorCode = data?.result?.ErrorCode ?? data?.ErrorCode ?? null;
//   const message = data?.message || data?.result?.ErrorMessage || null;

//   // Success if we have a token or if ErrorCode indicates success (e.g. '0')
//   const isSuccess = Boolean(token) || (errorCode !== null && String(errorCode) === '0');
//   if (!isSuccess) {
//     // If server returned a token in an unexpected place, include whole object in the error log
//     console.error('Login failed:', { status: res.status, errorCode, message, data });
//     throw new Error(message || 'Invalid username or password.');
//   }

//   // Extract fields that might be either top-level or nested
//   const userId = data?.userId ?? data?.UserId ?? data?.result?.UserId ?? data?.userId;
//   const userConfig = data?.userConfig ?? data?.UserConfig ?? data?.result?.userConfig ?? {};
//   const _data = data?.data ?? data?.result?.data ?? {};

//   if (token) localStorage.setItem("token", token);

//   // Normalise server payload for AuthContext which expects a `user` object.
//   const parsedDataForUser = _data || data || {};
//   const userInfo = {
//     token,
//     userId: userId || parsedDataForUser?.UserId || parsedDataForUser?.userId || "",
//     data: {
//       ErrorCode: parsedDataForUser?.ErrorCode,
//       ErrorMessage: parsedDataForUser?.ErrorMessage,
//       UserName: parsedDataForUser?.UserName,
//       OrgId: parsedDataForUser?.OrgId,
//       CollectionCenter: parsedDataForUser?.CollectionCenter,
//       UlbName: parsedDataForUser?.UlbName,
//     },
//     userConfig: userConfig || {},
//   };

//   // Save both the combined `user` object (used by AuthContext) and the
//   // individual keys for legacy code that reads them directly.
//   localStorage.setItem("user", JSON.stringify(userInfo));
  
//   // ⚠️ CRITICAL: Store userId as plain string (not JSON) so pages like
//   // DailyCollection.jsx that check `if (!userId)` work correctly.
//   // They use: const userId = localStorage.getItem("userId");
//   if (userInfo.userId) {
//     localStorage.setItem("userId", userInfo.userId);
//   }
  
//   localStorage.setItem("data", JSON.stringify(parsedDataForUser || {}));
//   localStorage.setItem("userConfig", JSON.stringify(userConfig || {}));

//   console.log("✅ Login successful, stored:", {
//     token: token ? "set" : "missing",
//     userId: userInfo.userId || "EMPTY",
//     user: JSON.parse(localStorage.getItem('user') || '{}'),
//   });

//   // 🔥 CRITICAL: Call AuthContext.login() to set up the React session state
//   // so that useAuth() hook returns the user and pages can access user?.userId
//   if (authLogin && typeof authLogin === 'function') {
//     authLogin(userInfo);
//     console.log('✅ AuthContext.login() called to set up session state');
//   }

//   if (_data?.otpValidate === "Y") {
//     localStorage.setItem("data", JSON.stringify(_data));
//   }
// }

// export default function FrontdoorLogin() {
//   const [msg, setMsg] = useState("Signing you in…");
//   const [done, setDone] = useState(false);
//   const { login } = useAuth(); // Get the login function from AuthContext

//   const payload = useMemo(() => {
//     const usp = new URLSearchParams(getQueryString());
//     return {
//       in_UserId: usp.get("in_UserId") || usp.get("user") || "",
//       in_password: usp.get("in_password") || usp.get("pass") || "",
//     };
//   }, []);

//   useEffect(() => {
//     // If already logged in, don’t call /Login again
//     const existingToken = localStorage.getItem("token");
//     if (existingToken) {
//       console.log('✅ Session already exists, redirecting to /home');
//       window.location.replace("/home");
//       return;
//     }

//     if (!payload.in_UserId || !payload.in_password) {
//       setMsg("Missing in_UserId or in_password in URL.");
//       setDone(true);
//       return;
//     }

//     // Prevent multiple calls in StrictMode: use a flag
//     let isMounted = true;

//     (async () => {
//       try {
//         await loginCall(payload, login);
//         if (isMounted) {
//           window.location.replace("/home");
//         }
//       } catch (err) {
//         console.error(err);
//         if (isMounted) {
//           setMsg(err.message || "Server error while logging in.");
//           setDone(true);
//         }
//       }
//     })();

//     return () => {
//       isMounted = false;
//     };
//   }, [payload, login]);

//   return (
//     <div style={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
//       <div style={{ maxWidth: 520 }}>
//         <h2>Frontdoor</h2>
//         <p>{msg}</p>
//         {done && <a href="/login">Go to Login</a>}
//       </div>
//     </div>
//   );
// }


// FrontdoorLogin.jsx
import React, { useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";

/** Read query from either /welcome?x=... or #/welcome?x=... */
function getQueryString() {
  let qs = window.location.search || "";
  if (!qs && window.location.hash) {
    const i = window.location.hash.indexOf("?");
    if (i >= 0) qs = window.location.hash.substring(i);
  }
  return qs.startsWith("?") ? qs.slice(1) : qs;
}

console.log("FrontdoorLogin loaded");

let inactivityTimer = null;

// 🚪 Logout function (only using localStorage, no AuthContext)
function logout() {
  clearTimeout(inactivityTimer);
  localStorage.removeItem("user");
  localStorage.removeItem("userId");
  localStorage.removeItem("token");
  localStorage.removeItem("data");
  localStorage.removeItem("userConfig");

  // Notify Flutter if running inside hybrid app WebView
  if (window.ToFlutter && window.ToFlutter.postMessage) {
    try {
      window.ToFlutter.postMessage(JSON.stringify({ type: "logout" }));
      window.ToFlutter.postMessage(JSON.stringify({ type: "navigate", route: "logout" }));
    } catch (err) {
      console.error("Error posting logout message to Flutter:", err);
    }
  }

  console.warn("Session expired or logged out.");
  window.location.replace("/");
}

// 🕒 Inactivity handling
function startInactivityTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    logout();
  }, 30 * 60 * 1000); // 30 minutes
}

function resetInactivityTimer() {
  startInactivityTimer();
}

function setupInactivityListeners() {
  ["mousemove", "keydown", "click", "scroll"].forEach((event) => {
    window.addEventListener(event, resetInactivityTimer);
  });
}

/**
 * Call /Login API and create session:
 *  - token, user, userId in localStorage
 *  - inactivity timer
 */
async function loginCall({ in_UserId, in_password }) {
  console.log("FrontdoorLogin loginCall", { in_UserId, in_password });

  let res;
  const apiBase = "https://mgmtapi.nagarkaryavalinewuat.com" || import.meta.env.VITE_API_BASE || "";
  const loginUrl = apiBase
    ? `${apiBase.replace(/\/$/, "")}/Login`
    : "/Login";

  try {
    res = await fetch(loginUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ in_UserId, in_password }),
    });
  } catch (networkErr) {
    console.error("Network error when calling /Login", networkErr);
    throw new Error("Network error while calling login.");
  }

  console.log(
    "Login response status:",
    res.status,
    "ok=",
    res.ok,
    "url=",
    res.url
  );

  // Debug preview
  try {
    const preview = await res.clone().json().catch(() => null);
    if (preview) console.log("Login response (clone):", preview);
  } catch (cloneErr) {
    console.warn("Could not read cloned response body", cloneErr);
  }

  // Non-200 handling
  if (!res.ok) {
    let errBody = null;
    try {
      errBody = await res.json();
    } catch (_e) {
      try {
        errBody = await res.text();
      } catch (_t) {
        errBody = null;
      }
    }
    console.error("Login request failed", {
      status: res.status,
      statusText: res.statusText,
      body: errBody,
    });
    const errMsg =
      (errBody &&
        (errBody.message ||
          errBody.ErrorMessage ||
          JSON.stringify(errBody))) ||
      `HTTP ${res.status} ${res.statusText}`;
    throw new Error(errMsg);
  }

  // Parse JSON
  let data = {};
  try {
    data = await res.json();
  } catch (e) {
    console.warn("Failed to parse JSON response from /Login", e);
    data = {};
  }

  console.log("Login response data:", data);

  // Normalise: token + error
  const token = data?.token || data?.result?.token;
  const errorCode = data?.result?.ErrorCode ?? data?.ErrorCode ?? null;
  const message = data?.message || data?.result?.ErrorMessage || null;

  const isSuccess =
    Boolean(token) || (errorCode !== null && String(errorCode) === "0");
  if (!isSuccess) {
    console.error("Login failed:", {
      status: res.status,
      errorCode,
      message,
      data,
    });
    throw new Error(message || "Invalid username or password.");
  }

  // Extract fields
  const apiUserId =
    data?.userId ?? data?.UserId ?? data?.result?.UserId ?? data?.userId ?? "";
  const userConfig =
    data?.userConfig ??
    data?.UserConfig ??
    data?.result?.userConfig ??
    {};
  const _data = data?.data ?? data?.result?.data ?? {};

  if (token) {
    localStorage.setItem("token", token);
  }

  const parsedDataForUser = _data || data || {};

  // 🧾 Decode JWT to resolve userId more safely
  let decoded = {};
  if (token) {
    try {
      decoded = jwtDecode(token);
      console.log("Decoded JWT:", decoded);
    } catch (err) {
      console.error("Error decoding token:", err);
    }
  }

  const resolvedUserId =
    apiUserId ||
    decoded.userId ||
    decoded.UserId ||
    decoded.uid ||
    decoded.sub ||
    decoded.nameid ||
    decoded.unique_name ||
    "";

  // 👉 Minimal but complete user object (same style as AuthContext.login before)
  const userInfo = {
    token: token || null,
    userId: resolvedUserId,
    data: {
      ErrorCode: parsedDataForUser?.ErrorCode,
      ErrorMessage: parsedDataForUser?.ErrorMessage,
      UserName: parsedDataForUser?.UserName,
      OrgId: parsedDataForUser?.OrgId,
      CollectionCenter: parsedDataForUser?.CollectionCenter,
      UlbName: parsedDataForUser?.UlbName,
    },
    userConfig: userConfig || {},
  };

  // ✅ Save all details in localStorage
  localStorage.setItem("user", JSON.stringify(userInfo));
  if (userInfo.userId) {
    localStorage.setItem("userId", userInfo.userId); // plain string
  } else {
    localStorage.removeItem("userId");
  }

  localStorage.setItem("data", JSON.stringify(parsedDataForUser || {}));
  localStorage.setItem("userConfig", JSON.stringify(userConfig || {}));

  if (_data?.otpValidate === "Y") {
    localStorage.setItem("data", JSON.stringify(_data));
  }

  console.log("✅ Login successful, stored:", {
    token: token ? "set" : "missing",
    userId: userInfo.userId || "EMPTY",
    user: JSON.parse(localStorage.getItem("user") || "{}"),
  });

  // 🔥 Set up inactivity just once on login
  setupInactivityListeners();
  startInactivityTimer();

  return userInfo;
}

export default function FrontdoorLogin() {
  const [msg, setMsg] = useState("Signing you in…");
  const [done, setDone] = useState(false);

  const payload = useMemo(() => {
    const usp = new URLSearchParams(getQueryString());
    return {
      in_UserId: usp.get("in_UserId") || usp.get("user") || "",
      in_password: usp.get("in_password") || usp.get("pass") || "",
    };
  }, []);

  useEffect(() => {
    // If already logged in, don’t call /Login again
    const existingToken = localStorage.getItem("token");
    const existingUserId = localStorage.getItem("userId");

    if (existingToken && existingUserId) {
      console.log(
        "✅ Session already exists (token + userId), redirecting to /home"
      );
      window.location.replace("/home");
      return;
    }

    if (!payload.in_UserId || !payload.in_password) {
      setMsg("Missing in_UserId or in_password in URL.");
      setDone(true);
      return;
    }

    let isMounted = true;

    (async () => {
      try {
        await loginCall(payload); // no useAuth, everything handled inside
        if (isMounted) {
          window.location.replace("/home");
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setMsg(err.message || "Server error while logging in.");
          setDone(true);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [payload]);

  return (
    <div style={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
      <div style={{ maxWidth: 520 }}>
        <h2>Frontdoor</h2>
        <p>{msg}</p>
        {done && <a href="/">Go to Login</a>}
      </div>
    </div>
  );
}
