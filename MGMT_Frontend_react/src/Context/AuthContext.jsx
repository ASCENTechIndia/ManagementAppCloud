import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();
let inactivityTimer;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🕒 Start auto logout timer (30 mins)
  const startInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      alert("Session expired due to inactivity.");
      logout();
    }, 30 * 60 * 1000); // 30 minutes
  };

  const resetInactivityTimer = () => startInactivityTimer();

  const setupInactivityListeners = () => {
    ["mousemove", "keydown", "click", "scroll"].forEach((event) => {
      window.addEventListener(event, resetInactivityTimer);
    });
  };

  // 🔐 Auto-login if token in storage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const decoded = jwtDecode(parsedUser.token);

        const isExpired = decoded.exp * 1000 < Date.now();
        if (isExpired) {
          console.warn("Token expired, logging out.");
          logout();
          return;
        }

        setUser(parsedUser);
        setupInactivityListeners();
        startInactivityTimer();
      } catch (error) {
        console.error("Error decoding token:", error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  // ✅ Login function (save only required info)
  const login = (userData) => {
    const { token, userId, data, userConfig } = userData;

    // Decode the token
    let decoded = {};
    try {
      decoded = jwtDecode(token);
    } catch (err) {
      console.error("Error decoding token:", err);
    }

    // Prepare minimal but complete user object
    const userInfo = {
      token,
      userId: decoded.userId || userId, // ensure userId stored
      data: {
        ErrorCode: data?.ErrorCode,
        ErrorMessage: data?.ErrorMessage,
        UserName: data?.UserName,
        OrgId: data?.OrgId,
        CollectionCenter: data?.CollectionCenter,
        UlbName: data?.UlbName,
      },
      userConfig: userConfig || {},
    };

    // ✅ Save all details in localStorage
    localStorage.setItem("user", JSON.stringify(userInfo));
    localStorage.setItem("userId", userInfo.userId); // ✅ store separately also

    setUser(userInfo);
    setupInactivityListeners();
    startInactivityTimer();
    setLoading(false);
  };

  // 🚪 Logout and clear everything
  const logout = () => {
    clearTimeout(inactivityTimer);
    localStorage.removeItem("user");
    localStorage.removeItem("userId"); // ✅ remove userId also
    setUser(null);
    setLoading(false);
    window.location.replace("/"); // Redirect to login
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
