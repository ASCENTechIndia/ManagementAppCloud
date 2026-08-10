
// import React from "react";
// import {
//     BsCheckCircleFill,
//     BsXCircleFill,
//     BsExclamationTriangleFill,
//     BsInfoCircleFill,
//     BsX,
// } from "react-icons/bs";

// const CustomAlert = ({ message, type = "info", onClose }) => {
//     const alertConfig = {
//         success: {
//             icon: <BsCheckCircleFill />,
//             title: "Success",
//             iconColor: "text-green-600",
//             borderColor: "border-green-500",
//         },
//         error: {
//             icon: <BsXCircleFill />,
//             title: "Error",
//             iconColor: "text-red-600",
//             borderColor: "border-red-500",
//         },
//         warning: {
//             icon: <BsExclamationTriangleFill />,
//             title: "Warning",
//             iconColor: "text-yellow-600",
//             borderColor: "border-yellow-500",
//         },
//         info: {
//             icon: <BsInfoCircleFill />,
//             title: "Information",
//             iconColor: "text-blue-600",
//             borderColor: "border-blue-500",
//         },
//     };

//     const config = alertConfig[type] || alertConfig.info;

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//             <div
//                 className={`relative w-[90%] max-w-md rounded-lg border-l-4 bg-white p-5 shadow-xl ${config.borderColor}`}
//             >
//                 {/* Close */}
//                 <button
//                     type="button"
//                     onClick={onClose}
//                     className="absolute right-3 top-3 text-gray-400 hover:text-gray-700"
//                 >
//                     <BsX size={22} />
//                 </button>

//                 {/* Content */}
//                 <div className="flex items-start gap-3">
//                     <div className={`mt-1 text-xl ${config.iconColor}`}>
//                         {config.icon}
//                     </div>

//                     <div className="pr-6">
//                         <h3 className="font-semibold text-gray-800">
//                             {config.title}
//                         </h3>

//                         <p className="mt-1 text-sm text-gray-600">
//                             {message}
//                         </p>
//                     </div>
//                 </div>

//                 {/* OK */}
//                 <div className="mt-5 flex justify-end">
//                     <button
//                         type="button"
//                         onClick={onClose}
//                         className="rounded-md bg-gray-800 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700"
//                     >
//                         OK
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CustomAlert;




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
            icon: <BsCheckCircleFill />,
            title: "Success",
            iconColor: "text-green-600",
            borderColor: "border-green-500",
        },
        error: {
            icon: <BsXCircleFill />,
            title: "Error",
            iconColor: "text-red-600",
            borderColor: "border-red-500",
        },
        warning: {
            icon: <BsExclamationTriangleFill />,
            title: "Warning",
            iconColor: "text-yellow-600",
            borderColor: "border-yellow-500",
        },
        info: {
            icon: <BsInfoCircleFill />,
            title: "Information",
            iconColor: "text-blue-600",
            borderColor: "border-blue-500",
        },
    };

    const config = alertConfig[type] || alertConfig.info;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5 py-5 sm:px-4">
            <div
                className={`
                    relative
                    w-full
                    max-w-[360px]
                    rounded-lg
                    border-t-4
                    bg-white
                    px-4
                    py-4
                    shadow-xl
                    sm:px-5
                    sm:py-5
                    ${config.borderColor}
                `}
            >
                {/* Close */}
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close alert"
                    className="absolute right-2 top-2 p-1 text-gray-400 transition hover:text-gray-700"
                >
                    <BsX size={20} />
                </button>

                {/* Icon */}
                <div
                    className={`
                        flex
                        justify-center
                        text-4xl
                        sm:text-5xl
                        ${config.iconColor}
                    `}
                >
                    {config.icon}
                </div>

                {/* Title */}
                <h3 className="mt-2 text-center text-base font-semibold text-gray-800 sm:text-lg">
                    {config.title}
                </h3>

                {/* Message */}
                <p className="mx-auto mt-1 max-w-[300px] text-center text-xs leading-5 text-gray-600 sm:text-sm">
                    {message}
                </p>

                {/* OK Button */}
                <div className="mt-3 flex justify-center sm:mt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            min-w-[80px]
                            rounded-md
                            bg-gray-800
                            px-4
                            py-1.5
                            text-xs
                            font-medium
                            text-white
                            transition
                            hover:bg-gray-700
                            sm:px-5
                            sm:py-2
                            sm:text-sm
                        "
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomAlert;





