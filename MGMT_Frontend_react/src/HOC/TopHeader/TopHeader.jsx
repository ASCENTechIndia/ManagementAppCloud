import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useAuth } from "../../Context/AuthContext";
import apiService from "../../../apiService";

const TopHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // ✅ Static ULB details
  const ulbLogo = "/mira-bhayander.jpg";
  const ulbNameMr = user?.data?.UlbName;
  const ulbNameEn = "Management Application";

  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* 🔹 Top Header */}
      <header className="w-full bg-gradient-to-b from-violet-400 to-violet-600 text-white shadow-md relative z-50">
        <div className="flex items-center justify-between px-4 py-2">
          {/* Left Side - Menu + Logo + Text */}
          <div className="flex items-center gap-3">
            {/* Menu Button */}
            <button
              onClick={handleMenuToggle}
              className="text-white text-2xl hover:text-gray-200"
            >
              <i className="bi bi-list"></i>
            </button>

            {/* Logo + Names */}
            <div className="flex items-center gap-2">
              <img
                src={ulbLogo}
                alt="ULB Logo"
                className="w-10 h-10 object-contain"
              />
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-[16px]">{ulbNameMr}</span>
                <span className="text-xs opacity-90">{ulbNameEn}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 🔹 Background Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={handleMenuToggle}
        ></div>
      )}

      {/* 🔹 Side Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#6b1d1d] text-white">
          <h2 className="text-lg font-semibold">मेनू</h2>
          <button onClick={handleMenuToggle} className="text-2xl">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col mt-4 px-4 space-y-3 text-gray-800">
          <button
            onClick={() => handleNavigation("/home")}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#f4f4f4] transition"
          >
            <i className="bi bi-house-fill text-[#2b8bd8] text-xl"></i>
            <span className="font-medium text-[15px]">Home</span>
          </button>
          <button
            onClick={() => handleNavigation("/propertydashboard")}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#f4f4f4] transition"
          >
            <i className="bi bi-house-fill text-[#2b8bd8] text-xl"></i>
            <span className="font-medium text-[15px]">मालमत्ता कर विभाग</span>
          </button>

          <button
            onClick={() => handleNavigation("/waterdashboard")}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#f4f4f4] transition"
          >
            <i className="bi bi-droplet-fill text-[#d62828] text-xl"></i>
            <span className="font-medium text-[15px]">पाणीपट्टी विभाग</span>
          </button>

          <button
            onClick={() => handleNavigation("/cms")}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#f4f4f4] transition"
          >
            <i className="bi bi-exclamation-octagon-fill text-[#f05426] text-xl"></i>
            <span className="font-medium text-[15px]">तक्रारी व सूचना</span>
          </button>

          <button onClick={() => handleNavigation("/CfcDashboard")}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#f4f4f4] transition"
          >
            <i className="bi bi-exclamation-octagon-fill text-[#f05426] text-xl"></i>
            <span className="font-medium text-[15px]">CFC Dashboard</span></button>
        </nav>

        {/* Logout */}
        <div className="absolute bottom-5 left-0 w-full px-4 md:block hidden">
          <button
            onClick={() => handleNavigation("/")}
            className="flex items-center gap-3 w-full p-3 rounded-lg bg-[#6b1d1d] text-white hover:bg-[#5a1717] transition"
          >
            <i className="bi bi-box-arrow-right text-xl"></i>
            <span className="font-medium text-[15px]">लॉग आऊट</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default TopHeader;
