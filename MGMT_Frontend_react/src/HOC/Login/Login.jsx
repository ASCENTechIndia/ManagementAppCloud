import { FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiService from '../../../apiService';
import { useLoader } from '../../Context/LoaderContext';
const jcmcLogo = "/assets/Images/JCMC.png";
import { BsFillBuildingsFill, BsPersonFill, BsLockFill } from 'react-icons/bs';
import Cookies from '../../utils/cookieUtils';

// Decode JWT payload locally to avoid duplicate bundle/import side-effects in Vite
const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    return null;
  }
};

const Login = () => {
  const [error, setError] = useState(null);
  const { setLoading } = useLoader();
  const navigate = useNavigate();
  const [realPassword, setRealPassword] = useState("");
  const [displayPassword, setDisplayPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    in_UserId: "",
    in_password: "",
  });

  const { login } = useAuth();

  useEffect(() => {
    const savedUser = Cookies.get('remember_username');
    const savedPass = Cookies.get('remember_password');
    const savedRemember = Cookies.get('remember_me');

    if (savedUser && savedPass) {
      setFormData({
        in_UserId: savedUser,
        in_password: savedPass,
      });
      setRealPassword(savedPass);
      setDisplayPassword(savedPass);
      setRememberMe(savedRemember === 'true' || true);
    }
  }, []);

    useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        const isExpired = decoded.exp * 1000 < Date.now();
        if (!isExpired) {
          navigate("/home", { replace: true });
        }
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "in_password") {
      setRealPassword(value);
      setDisplayPassword(value);
    }
  };

  const handleBlur = () => {
    if (realPassword.length > 0 && !showPassword) {
      setDisplayPassword("•".repeat(10));
    }
  };

  const handleFocus = () => {
    setDisplayPassword(realPassword);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    if (!showPassword) {
      setDisplayPassword(realPassword);
    } else {
      setDisplayPassword("•".repeat(10));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!formData.in_UserId || !formData.in_password) {
      setError("Username and password are required.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await apiService.post(`login`, formData);
      console.log("Form Data:", formData);
      console.log("API Response:", res);
      if (String(res.data?.data?.ErrorCode) !== "9999") {
        setError(
          res.data?.data?.ErrorMessage || "Invalid username or password."
        );
        setIsLoading(false);
        return;
      }
      if (!res.data || (res.data?.result?.out_ErrorCode !== 0 && !res.data.token)) {
        setError(res.data?.message || "Invalid username or password.");

        setIsLoading(false);
        return;
      }

      const { token, userId, data, userConfig } = res.data;
      console.log("Login Successful! Proceeding...");

      if (rememberMe) {
        Cookies.set('remember_username', formData.in_UserId, { expires: 30, path: '/' });
        Cookies.set('remember_password', formData.in_password, { expires: 30, path: '/' });
        Cookies.set('remember_me', 'true', { expires: 30, path: '/' });
      } else {
        Cookies.remove('remember_username', { path: '/' });
        Cookies.remove('remember_password', { path: '/' });
        Cookies.remove('remember_me', { path: '/' });
      }

      localStorage.setItem("token", token);
      localStorage.setItem("userId", JSON.stringify(userId));
      localStorage.setItem("data", JSON.stringify(data));
      localStorage.setItem("userConfig", JSON.stringify(userConfig));
      // login(token,userId, data, userConfig);
      login({
        token,
        userId,
        data,
        userConfig,
      });


      if (data.otpValidate === "Y") {
        console.log("OTP Validated. Redirecting to Dashboard...");
        localStorage.setItem("data", JSON.stringify(data));
        navigate("/home");
      } else {
        navigate("/home");
      }

    } catch (err) {
      console.error("Login API Error:", err);
      const backendMessage = err?.response?.data?.message;
      const fallbackMessage = err?.message?.includes("salt")
        ? "Invalid username or password."
        : backendMessage || err.message || "An error occurred";

      setError(fallbackMessage);

    } finally {
      setIsLoading(false);
    }
  };

  return (

    <div className='min-h-screen flex items-center justify-center' style={{
      background: "linear-gradient(135deg, #0F3FAE, #3D71F5)"
    }}>
      <div className="w-[90%] sm:w-[430px] md:p-5">
        <div className="bg-white rounded-[30px] px-[30px] py-10 shadow-[0_20px_40px_rgba(0,0,0,0.18)] animate-fadeUp">
          <div className="w-[90px] h-[90px] mx-auto  flex items-center justify-center text-white text-[50px] " style={{
            marginBottom: "20px"
          }}>
            <img
              src={jcmcLogo}
              alt="JCMC Logo"
              className="w-[90px] h-[90px] object-contain"
            />
          </div>
          <h2 className='text-center mb-1 sm:mb-[55px]' style={{
            fontWeight: 700
          }}>
            Management App
          </h2>
          <p className="text-center text-[0.9rem] text-[#777] sm:text-[1rem]" style={{
            marginBottom: "30px"
          }}>
            Welcome Back
          </p>

          <form onSubmit={handleSubmit} autoComplete="on">
            <div className="mb-3">
              <label className="mb-2 block text-sm sm:text-base font-semibold">
                Username
              </label>

              <div className="relative">
                <BsPersonFill className="absolute left-[18px] top-1/2 -translate-y-1/2 text-[#2155CD] text-[18px]" />

                {/* <input
                                        type="text"
                                        placeholder="Enter Username"
                                        className="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                    /> */}
                <input
                  type="text"
                  name="in_UserId"
                  id="in_UserId"
                  autoComplete="username"
                  value={formData.in_UserId}
                  onChange={handleChange}
                  placeholder="Enter Username"
                  className="h-[55px] w-full rounded-[30px] border border-[#d7d7d7] pl-[50px] focus:border-[#2155CD] focus:outline-none focus:shadow-[0_0_0_.15rem_rgba(33,85,205,.25)]"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="mb-2 block text-sm sm:text-base font-semibold">
                Password
              </label>

              <div className="relative">
                <BsLockFill className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" color='#0F3FAE' />

                <input
                  type={showPassword ? "text" : "password"}
                  name="in_password"
                  id="in_password"
                  autoComplete="current-password"
                  value={formData.in_password}
                  onChange={handleChange}
                  placeholder="Enter Password"
                  className="h-[55px] w-full rounded-[30px] border border-[#d7d7d7] pl-[50px] pr-[50px] focus:border-[#2155CD] focus:outline-none focus:shadow-[0_0_0_.15rem_rgba(33,85,205,.25)]"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash className="text-lg text-gray-500" /> : <FaEye className="text-lg text-gray-500" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4 px-2">
              <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-700 font-medium select-none">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#2155CD] rounded border-gray-300 focus:ring-[#2155CD] cursor-pointer"
                />
                <span className="ml-1.5">Remember Me</span>
              </label>
            </div>

            {error && (
              <div
                className="mt-3 mb-2 rounded-lg bg-red-100 border border-red-300 px-3 py-2 text-sm text-red-700"
                style={{ fontFamily: "sans-serif" }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[55px] border-0 bg-gradient-to-br from-[#2155CD] to-[#4C6FFF] text-white font-semibold text-[18px] transition duration-300 hover:-translate-y-[2px] hover:text-white mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                borderRadius: "30px",
                fontSize: "18px",
              }}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>

    </div>
  );
};

export default Login;