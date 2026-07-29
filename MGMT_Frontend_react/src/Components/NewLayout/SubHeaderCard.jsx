import React from "react";

/**
 * SubHeaderCard Component
 * Gradient banner component for summaries/subheaders matching NewLayout design.
 * 
 * @param {Object} props
 * @param {string} [props.subtitle="Ward"] - Category/Tag label
 * @param {string} [props.title="All Wards"] - Main heading
 * @param {string} [props.infoText="15 Jul 2026 - 15 Jul 2026"] - Date range or secondary description
 * @param {string|React.ReactNode} [props.value="0"] - Highlighted total amount/stat badge
 * @param {string} [props.className=""] - Additional custom Tailwind classes
 */
const SubHeaderCard = ({
    subtitle = "Ward",
    title = "All Wards",
    infoText = "",
    value = "0",
    className = "",
}) => {
    return (
        <section className={`container mx-auto px-4 ${className}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[24px] bg-gradient-to-br from-[#2155CD] to-[#4C6FFF] p-5 sm:p-6 text-white shadow-[0_12px_30px_rgba(0,0,0,0.12)] transition-all duration-300">
                <div className="flex-1 min-w-0">
                    {subtitle && (
                        <small className="text-xs sm:text-sm text-white/90 font-medium block">
                            {subtitle}
                        </small>
                    )}

                    <h3 className="my-1 font-semibold text-xl sm:text-2xl truncate">
                        {title}
                    </h3>

                    {infoText && (
                        <span className="text-[13px] sm:text-[14px] opacity-90 block">
                            {infoText}
                        </span>
                    )}
                </div>

                {/* {value && (
                    <div className="flex h-[80px] w-[80px] sm:h-[95px] sm:w-[95px] shrink-0 items-center justify-center rounded-full bg-white/20 text-[17px] sm:text-[20px] font-bold backdrop-blur-[8px] self-end sm:self-center text-white shadow-inner">
                        {value}
                    </div>
                )} */}
            </div>
        </section>
    );
};

export default SubHeaderCard;
