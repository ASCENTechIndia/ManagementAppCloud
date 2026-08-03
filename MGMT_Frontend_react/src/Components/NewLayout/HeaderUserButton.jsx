import { useRef, useState, useEffect } from "react";
import {
    BsPersonCircle,
    BsCashStack,
    BsFillHouseFill,
    BsExclamationCircleFill,
    BsBuildingFill,
    BsCashCoin,
    BsBoxArrowRight,
    BsPerson,
    BsSignDeadEnd,
    BsArrowBarUp,
    BsFire,
    BsServer
} from "react-icons/bs";
import { FaUserCircle, FaHome, FaTint, FaExclamationCircle, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
const menuOptions = [
    {
        name: "Home",
        icon: BsFillHouseFill,
        link: "/home"
    },
    // {
    //     name: "मालमत्ता कर विभाग",
    //     icon: BsFillHouseFill,
    //     link: "/propertydashboard"
    // },
    // {
    //     name: "पाणीपट्टी विभाग",
    //     icon: FaTint,
    //     link: "/waterdashboard"
    // },
    {
        name: "तक्रारी व सूचना",
        icon: BsExclamationCircleFill,
        link: "/CADDashboard"
    },
     {
        name: "विवाह नोंदणी",
        icon: BsPerson,
        link: "/Marriage"
    },
    //  {
    //     name: "जन्म व मृत्यू नोंदणी",
    //     icon: BsSignDeadEnd,
    //     link: "/BirthAndDeath"
    // },
    // {
    //     name: "आवक जावक विभाग",
    //     icon: BsArrowBarUp,
    //     link: "/IncomeOutgoing"
    // },
    {
        name: "सी.फ.सी विभाग",
        icon: BsCashCoin,
        link: "/CfcDashBoard"
    },
   {
        name: "मार्केट विभाग",
        icon: BsCashStack,
        link: "/market"
    },
    {
        name: "इस्टेट विभाग",
        icon: BsBuildingFill,
        link: "/Estate"
    },{
        name: "फायर विभाग",
        icon: BsFire,
        link: "/Fire"
    },
     {
        name: "RTS विभाग",
        icon: BsServer,
        link: "/Rts"
    },
    //  {
    //     name: "Accounts विभाग",
    //     icon: BsCashCoin,
    //     link: "/CfcDashBoard"
    // },
];
const HeaderUserButton = ({ logOut }) => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

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

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
    }, []);

    const handleNavigate = (link) => {
        setShowDropdown(false);
        navigate(link);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className="flex h-[42px] w-[42px] items-center justify-center border-0 bg-white/20 text-white backdrop-blur-[10px]"
                style={{
                    borderRadius: "50%"
                }}
                onClick={() => setShowDropdown((prev) => !prev)}
            >
                <BsPersonCircle size={20} />
            </button>

            {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-60 rounded-xl border border-gray-200 bg-white shadow-xl z-50 overflow-hidden">
                    <div className="px-4 py-3 bg-gradient-to-br from-blue-700 to-purple-400 text-white">
                        <div className="font-semibold text-sm truncate">{user?.data?.UserName || ""}</div>
                        <div className="text-xs text-white/80 truncate mt-0.5">{user?.data?.UlbName || ""}</div>
                    </div>
                    {menuOptions.map((item) => {
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.link}
                                onClick={() => handleNavigate(item.link)}
                                className="flex w-full items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                                style={{
                                    border: "none",
                                    cursor: "pointer",
                                    fontFamily: "sans-serif",
                                }}
                            >
                                <Icon className="mr-3" size={16} />
                                {item.name}
                            </button>
                        );
                    })}

                    <div className="border-t border-gray-200" />

                    <button
                        onClick={() => {
                            setShowDropdown(false);
                            logOut();
                        }}
                        className="flex w-full items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                        style={{
                            border: "none",
                            cursor: "pointer",
                            fontFamily: "sans-serif",
                        }}
                    >
                        <BsBoxArrowRight className="mr-3" size={16} />
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default HeaderUserButton;