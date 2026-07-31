// import { FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import { BsFillBuildingsFill, BsPersonFill, BsLockFill } from 'react-icons/bs';
import { useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiService from '../../../apiService';
import { useLoader } from '../../Context/LoaderContext';
import './loginnew.css'

const LoginNew = () => {
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

            if (!res.data?.token) {
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
                window.location.href = "/home";
            } else {
                window.location.href = "/home";
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

                    <form onSubmit={handleSubmit}>
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

                                {/* <input
                                    type="password"
                                    placeholder="Enter Password"
                                    className="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                /> */}
                                <input
                                    type="password"
                                    name="in_password"
                                    value={formData.in_password}
                                    onChange={handleChange}
                                    placeholder="Enter Password"
                                    className="h-[55px] w-full rounded-[30px] border border-[#d7d7d7] pl-[50px] focus:border-[#2155CD] focus:outline-none focus:shadow-[0_0_0_.15rem_rgba(33,85,205,.25)]"
                                />
                            </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-1">
                            <label className="flex items-center justify-center gap-2">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 accent-[#2155CD] focus:outline-none focus:shadow-[0_0_0_.15rem_rgba(33,85,205,.15)]"
                                    style={{
                                        marginRight: "5px"
                                    }}
                                />

                                <span className="text-sm md:text-base text-gray-700">Remember <span className='ml-5 sm:ml-0'>Me</span></span>
                            </label>


                            <a
                                href="#"
                                className="text-[14px] font-semibold text-[#0F3FAE] forget-password"
                            >
                                Forgot Password?
                            </a>
                        </div>

                        {error && (
                            <div
                                className="mt-3 rounded-lg bg-red-100 border border-red-300 px-3 py-2 text-sm text-red-700"
                                style={{ fontFamily: "sans-serif" }}
                            >
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-[55px] border-0 bg-gradient-to-br from-[#2155CD] to-[#4C6FFF] text-white font-semibold text-[18px] transition duration-300 hover:-translate-y-[2px] hover:text-white mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
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
    )
};

export default LoginNew;