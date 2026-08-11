
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
            borderColor: "border-green-500",
            bgColor: "bg-green-50",
            textColor: "text-green-800",
        },
        error: {
            borderColor: "border-red-500",
            bgColor: "bg-red-50",
            textColor: "text-red-800",
        },
        warning: {
            borderColor: "border-yellow-500",
            bgColor: "bg-yellow-50",
            textColor: "text-yellow-800",
        },
        info: {
            borderColor: "border-blue-500",
            bgColor: "bg-blue-50",
            textColor: "text-blue-800",
        },
    };

    const config = alertConfig[type] || alertConfig.info;

    return (
        <div className="fixed bottom-5 left-1/2 z-[9999] w-full max-w-md -translate-x-1/2 px-4">
            <div
                className={`
          ${config.bgColor}
          ${config.borderColor}
          relative
          w-full
          rounded-lg
          border
          border-l-4
          px-10
          py-4
          shadow-lg
        `}
            >
                {/* Message */}
                <div
                    className={`
            ${config.textColor}
            text-sm
            font-medium
            leading-relaxed
            text-center
            break-words
          `}
                >
                    {message}
                </div>

                {/* Cross - Right End */}
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className={`
            absolute
            right-2
            top-1/2
            -translate-y-1/2
            rounded-full
            p-1
            ${config.textColor}
            opacity-60
            transition
            hover:bg-white/60
            hover:opacity-100
          `}
                >
                    <BsX size={20} />
                </button>
            </div>
        </div>
    );
};

export default CustomAlert;






