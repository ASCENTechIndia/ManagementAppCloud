import { FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiService from '../../../apiService';
import { useLoader } from '../../Context/LoaderContext';
import { BsFillBuildingsFill, BsPersonFill, BsLockFill } from 'react-icons/bs';

const Login = () => {
  const [error, setError] = useState(null);
  const { setLoading } = useLoader();
  const navigate = useNavigate();
  const [realPassword, setRealPassword] = useState("");
  const [displayPassword, setDisplayPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    in_UserId: "",
    in_password: "",
  });

  const { login } = useAuth();

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
    // <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 fixed inset-0 overflow-hidden">
    //   <div className="w-full max-w-md mx-auto"> {/* Changed back to md for better proportions */}
    //     <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl"> {/* Removed max-height and flex-col */}

    //       {/* Header Section - Compact */}
    //       <div className="bg-white py-6 px-6 text-center border-b border-gray-200 relative overflow-hidden"> {/* Reduced padding */}
    //         {/* Subtle background pattern */}
    //         <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-30"></div>

    //         <div className="relative z-10 flex flex-col items-center">
    //           <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 border-2 border-blue-100 shadow-sm"> {/* Smaller icon */}
    //             <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
    //               <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5V7H9V5.5L3 7V9L9 10.5V12L3 13.5V15.5L9 14V16L3 17.5V19.5L9 18V22H15V18L21 19.5V17.5L15 16V14L21 15.5V13.5L15 12V10.5L21 9Z"/>
    //             </svg>
    //           </div>

    //           <h3 className="text-sm font-bold text-gray-900 mb-1"> {/* Smaller text */}
    //            Management Application
    //           </h3>

    //           <div className="w-12 h-0.5 bg-blue-500 rounded-full mb-2"></div> {/* Smaller divider */}

    //           <p className="text-gray-600 text-xs font-medium"> {/* Smaller text */}

    //           </p>
    //         </div>
    //       </div>

    //       {/* Login Form - No scroll needed */}
    //       <form onSubmit={handleSubmit} className="p-6 space-y-5"> {/* Reduced padding and spacing */}
    //         {/* Username Input */}
    //         <div className="space-y-2">
    //           <label 
    //             htmlFor="in_UserId" 
    //             className="block text-sm font-semibold text-gray-700"
    //           >
    //             User ID
    //           </label>
    //           <div className="relative">
    //             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    //               <FaUser className="h-4 w-4 text-gray-400" /> {/* Smaller icon */}
    //             </div>
    //             <input
    //               type="text"
    //               id="in_UserId"
    //               name="in_UserId"
    //               placeholder="Enter your User ID"
    //               className="block w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-sm" 
    //               value={formData.in_UserId}
    //               onChange={handleChange}
    //               required
    //             />
    //           </div>
    //         </div>

    //         {/* Password Input */}
    //         <div className="space-y-2">
    //           <label 
    //             htmlFor="in_password" 
    //             className="block text-sm font-semibold text-gray-700"
    //           >
    //             Password
    //           </label>
    //           <div className="relative">
    //             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    //               <FaLock className="h-4 w-4 text-gray-400" /> {/* Smaller icon */}
    //             </div>
    //             <input
    //               type={showPassword ? "text" : "password"}
    //               id="in_password"
    //               name="in_password"
    //               placeholder="Enter your password"
    //               className="block w-full pl-9 pr-10 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-sm" 
    //               required
    //               value={displayPassword}
    //               onChange={handleChange}
    //               onBlur={handleBlur}
    //               onFocus={handleFocus}
    //             />
    //             <button 
    //               type="button" 
    //               className="absolute inset-y-0 right-0 pr-3 flex items-center"
    //               onClick={togglePasswordVisibility}
    //             >
    //               {showPassword ? (
    //                 <FaEyeSlash className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" /> 
    //               ) : (
    //                 <FaEye className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" /> 
    //               )}
    //             </button>
    //           </div>
    //         </div>

    //         {/* Error Message */}
    //         {error && (
    //           <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg flex items-center space-x-2 text-sm"> {/* Smaller padding and text */}
    //             <span className="text-red-500 text-xs">⚠</span>
    //             <span className="font-medium">{error}</span>
    //           </div>
    //         )}

    //         {/* Login Button */}
    //         <button
    //           type="submit"
    //           disabled={isLoading}
    //           className={`w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${
    //             isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'
    //           }`} 
    //         >
    //           {isLoading ? (
    //             <>
    //               <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> 
    //             </>
    //           ) : (
    //             'Login'
    //           )}
    //         </button>
    //       </form>

    //       {/* Footer - Compact */}
    //       <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-center"> {/* Reduced padding */}
    //         <p className="text-xs font-medium text-gray-600 mb-1">
    //           Version: 1.0
    //         </p>
    //         <p className="text-xs text-gray-500">
    //           © 2025-2026 ascentech
    //         </p>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className='min-h-screen flex items-center justify-center' style={{
      background: "linear-gradient(135deg, #0F3FAE, #3D71F5)"
    }}>
      <div className="w-[90%] sm:w-[430px] md:p-5">
        <div className="bg-white rounded-[30px] px-[30px] py-10 shadow-[0_20px_40px_rgba(0,0,0,0.18)] animate-fadeUp">
          <div className="w-[90px] h-[90px] mx-auto rounded-full bg-gradient-to-br from-[#2155CD] to-[#4C6FFF] flex items-center justify-center text-white text-[42px] shadow-[0_15px_25px_rgba(0,0,0,0.18)]" style={{
            marginBottom: "20px"
          }}>
            <BsFillBuildingsFill />
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
                  type="password"
                  name="in_password"
                  id="in_password"
                  autoComplete="current-password"
                  value={formData.in_password}
                  onChange={handleChange}
                  placeholder="Enter Password"
                  className="h-[55px] w-full rounded-[30px] border border-[#d7d7d7] pl-[50px] focus:border-[#2155CD] focus:outline-none focus:shadow-[0_0_0_.15rem_rgba(33,85,205,.25)]"
                />
              </div>
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