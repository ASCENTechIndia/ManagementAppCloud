import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../HOC/Navbar/Navbar";
import TopHeader from "../../HOC/TopHeader/TopHeader";
import {
  BsPersonCircle,
  BsCashStack,
  BsFillHouseFill,
  BsExclamationCircleFill,
  BsBuildingFill,
  BsCashCoin,
  BsBoxArrowRight
} from "react-icons/bs";
import { FaUserCircle, FaHome, FaTint, FaExclamationCircle, FaChevronRight } from "react-icons/fa";
import "./NewHomeScreenstyles.css";
import { useAuth } from "../../Context/AuthContext";
import HeaderUserButton from "../../Components/NewLayout/HeaderUserButton";

const departments = [
  {
    name: "मालमत्ता कर विभाग",
    subtitle: "Property Tax",
    icon: BsFillHouseFill,
    border: "border-l-blue-500",
    iconBg: "bg-gradient-to-br from-blue-500 to-cyan-400",
    route: "property_tax"
  },
  {
    name: "पाणीपट्टी विभाग",
    subtitle: "Water Tax",
    icon: FaTint,
    border: "border-l-emerald-500",
    iconBg: "bg-gradient-to-br from-emerald-500 to-emerald-300",
    route: "water_tax"
  },
  {
    name: "तक्रारी व सूचना",
    subtitle: "Complaint & Suggestion",
    icon: BsExclamationCircleFill,
    border: "border-l-orange-500",
    iconBg: "bg-gradient-to-br from-orange-500 to-amber-400",
    route: "complaints"
  },
  {
    name: "प्रशासकीय विभाग",
    subtitle: "Administration",
    icon: BsBuildingFill,
    border: "border-l-green-700",
    iconBg: "bg-gradient-to-br from-green-700 to-green-400",
    route: "admin"
  },
  {
    name: "सी.फ.सी विभाग",
    subtitle: "CFC Department",
    icon: BsCashCoin,
    border: "border-l-purple-700",
    iconBg: "bg-gradient-to-br from-purple-700 to-purple-400",
    route: "cfc"
  },
];

const HomeScreen = () => {
  const navigate = useNavigate();
  // const [menuOpen, setMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  }

  const onTap = (route) => {

    const payload = { type: "navigate", route };

    // ✅ If running inside Flutter (hybrid app)
    if (window.ToFlutter && window.ToFlutter.postMessage) {
      window.ToFlutter.postMessage(JSON.stringify(payload));
    }
    // ✅ Otherwise, navigate using React Router (web case)
    else {
      if (route === "property_tax") {
        navigate("/propertydashboard"); // 👈 go to Dashboard page
      } else if (route === "water_tax") {
        navigate("/waterdashboard");
      } else if (route === "complaints") {
        // navigate("/CrmDashBoardOut");
        navigate("/CADDashboard");
      } else if (route === "admin") {
        navigate("/Administrative");
        // navigate("/AdminDashboard");
      } else if (route === "cfc") {
        navigate("/CfcDashBoard");
      } else if (route === "death") {
        navigate("/Death");
      } else {
        navigate(`/${route}`); // fallback if you want dynamic routes
      }
    }
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (

    <div className="min-h-screen bg-[#eef4ff]">
      <header className="bg-gradient-to-br from-[#0F3FAE] to-[#3D71F5] rounded-b-[30px] text-white shadow-[0_12px_30px_rgba(0,0,0,0.12)] header-section">
        <div className="flex items-center justify-between">
          <div>
            <small className="text-white/50" style={{
              fontFamily: "sans-serif",
              fontSize: "0.9rem"
            }}>
              Welcome
            </small>

            <h2 className="font-bold mt-1 md:mt-2" style={{
              fontFamily: "sans-serif"
            }}>
              Management App
            </h2>
          </div>

          <div className="flex gap-[10px]">
            <HeaderUserButton logOut={logout} />
          </div>
        </div>
      </header>
      <div className="mx-auto card-div">
        <section className="mx-auto mt-[-25px] rounded-[20px] bg-white shadow-lg card-section">
          <h5 className="mb-1" style={{
            fontFamily: "sans-serif",
            fontWeight: 600,
            fontSize: '1.2rem'
          }}>
            Choose Department
          </h5>

          <p className="text-sm text-gray-500" style={{
            fontFamily: "sans-serif",
            marginBottom: "1.2rem"
          }}>
            Select any service to continue
          </p>

          <div className="space-y-3.5 ">
            {departments.map((dept) => {
              const Icon = dept.icon;

              return (
                <a
                  key={dept.name}
                  className={`group flex items-center justify-between rounded-[18px] border-l-[5px] ${dept.border} text-black bg-white px-3 py-3.5 shadow-md transition duration-200 hover:-translate-y-1 tile-section`}
                  style={{
                    textDecoration: "none"
                  }}
                  onClick={() => onTap(dept.route)}
                >
                  <div className="flex items-center">
                    <div
                      className={`mr-3 flex h-[52px] w-[52px] items-center justify-center rounded-full text-white ${dept.iconBg}`}
                    >
                      <Icon size={22} />
                    </div>

                    <div>
                      <h4 className="tile-title">{dept.name}</h4>
                      <span className="block text-sm text-gray-500 tile-subtitle" style={{
                        fontFamily: "sans-serif",
                        fontSize: "0.75rem"
                      }}>
                        {dept.subtitle}
                      </span>
                    </div>
                  </div>

                  <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-indigo-50 text-[#2155CD] transition group-hover:bg-[#2155CD] group-hover:text-white">
                    <FaChevronRight size={14} />
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      </div>

    </div>
  );
};

export default HomeScreen;
