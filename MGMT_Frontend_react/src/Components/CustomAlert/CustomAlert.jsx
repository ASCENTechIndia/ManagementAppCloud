import React from "react";
import {
    BsCheckCircleFill,
    BsXCircleFill,
    BsExclamationTriangleFill,
    BsInfoCircleFill,
    BsX,
} from "react-icons/bs";

const CustomAlert = ({ message, type = "info", onClose }) => {
    const alertConfig = {
        success: {
            border: "border-emerald-200",
            iconBg: "bg-emerald-100 text-emerald-600",
            icon: <BsCheckCircleFill className="w-4 h-4" />,
        },
        error: {
            border: "border-rose-200",
            iconBg: "bg-rose-100 text-rose-600",
            icon: <BsXCircleFill className="w-4 h-4" />,
        },
        warning: {
            border: "border-amber-200",
            iconBg: "bg-amber-100 text-amber-600",
            icon: <BsExclamationTriangleFill className="w-4 h-4" />,
        },
        info: {
            border: "border-blue-200",
            iconBg: "bg-blue-100 text-blue-600",
            icon: <BsInfoCircleFill className="w-4 h-4" />,
        },
    };

    const config = alertConfig[type] || alertConfig.info;

    return (
        <div className="fixed bottom-6 left-1/2 z-[9999] -translate-x-1/2 px-4 pointer-events-none w-full max-w-sm sm:max-w-md flex justify-center">
            <div
                className={`
          pointer-events-auto
          flex items-center gap-3
          bg-white/95 backdrop-blur-md
          border ${config.border}
          rounded-2xl sm:rounded-full
          px-4 py-2.5
          shadow-[0_10px_25px_-5px_rgba(0,0,0,0.12),0_8px_10px_-6px_rgba(0,0,0,0.08)]
          transition-all duration-300
          animate-in fade-in slide-in-from-bottom-5
        `}
            >
                <div className={`p-1.5 rounded-full ${config.iconBg} flex items-center justify-center shrink-0`}>
                    {config.icon}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-800 leading-tight pr-1 break-words">
                    {message}
                </span>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="ml-auto p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors shrink-0"
                >
                    <BsX className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default CustomAlert;






