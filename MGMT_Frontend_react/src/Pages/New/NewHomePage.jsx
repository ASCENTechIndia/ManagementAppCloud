import { useState } from "react";
import {
    BsSearch,
    BsBell,
    BsPersonCircle,
    BsCashStack,
    BsFillHouseFill,
    BsExclamationCircleFill  
} from "react-icons/bs";
import { FaUserCircle, FaHome, FaTint, FaExclamationCircle, FaChevronRight } from "react-icons/fa";
import './NewHomePagestyles.css';

const departments = [
    {
        name: "मालमत्ता कर विभाग",
        subtitle: "Property Tax",
        icon: BsFillHouseFill,
        border: "border-l-blue-500",
        iconBg: "bg-gradient-to-br from-blue-500 to-cyan-400",
    },
    {
        name: "पाणीपट्टी विभाग",
        subtitle: "Water Tax",
        icon: FaTint,
        border: "border-l-emerald-500",
        iconBg: "bg-gradient-to-br from-emerald-500 to-emerald-300",
    },
    {
        name: "तक्रारी व सूचना",
        subtitle: "Complaint & Suggestion",
        icon: BsExclamationCircleFill,
        border: "border-l-orange-500",
        iconBg: "bg-gradient-to-br from-orange-500 to-amber-400",
    },
];

const NewHomePage = () => {
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
                            Property Dashboard
                        </h2>
                    </div>

                    <div className="flex gap-[10px]">
                        {/* <button className="flex h-[42px] w-[42px] items-center justify-center border-0 bg-white/20 text-[20px] text-white backdrop-blur-[10px]" style={{
                                            borderRadius: "50%"
                                        }}>
                                            <BsSearch size={20} />
                                        </button>
                
                                        <button className="flex h-[42px] w-[42px] items-center justify-center border-0 bg-white/20 text-[20px] text-white backdrop-blur-[10px]" style={{
                                            borderRadius: "50%"
                                        }}>
                                            <BsBell size={20} />
                                        </button> */}

                        <button className="flex h-[42px] w-[42px] items-center justify-center border-0 bg-white/20 text-[20px] text-white backdrop-blur-[10px]" style={{
                            borderRadius: "50%"
                        }}>
                            <BsPersonCircle size={20} />
                        </button>
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

                    <p className="text-sm text-gray-500"  style={{
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
                                    href="#"
                                    className={`group flex items-center justify-between rounded-[18px] border-l-[5px] ${dept.border} text-black bg-white px-3 py-3.5 shadow-md transition duration-200 hover:-translate-y-1 tile-section`}
                                    style={{
                                        textDecoration: "none"
                                    }}
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
    )
};

export default NewHomePage;