import React from "react";

/**
 * CustomButton Component
 * Supports multiple design variants matching the NewLayout design system.
 * 
 * @param {Object} props
 * @param {'primary' | 'icon-glass' | 'view-toggle' | 'secondary' | 'outline'} [props.variant='primary']
 * @param {React.ReactNode} [props.icon] - Icon component or element to render inside
 * @param {React.ReactNode} [props.children] - Button content or text
 * @param {boolean} [props.active=false] - For view-toggle variant (active state)
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {boolean} [props.fullWidth=false] - Width 100%
 * @param {Function} [props.onClick] - Click handler
 * @param {string} [props.className=''] - Extra Tailwind CSS classes
 * @param {string} [props.type='button'] - Button HTML type
 */
const CustomButton = ({
    variant = "primary",
    icon,
    children,
    active = false,
    disabled = false,
    fullWidth = false,
    onClick,
    className = "",
    type = "button",
    style,
    ...restProps
}) => {
    let baseStyles = "inline-flex items-center justify-center transition duration-300 font-semibold focus:outline-none";

    let variantStyles = "";
    let inlineStyles = { ...style };

    switch (variant) {
        case "primary":
            variantStyles = "h-[55px] gap-2 text-[17px] text-white bg-gradient-to-br from-[#2155CD] to-[#4C6FFF] hover:-translate-y-[2px] shadow-[0_10px_20px_rgba(33,85,205,0.25)] active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none";
            inlineStyles.borderRadius = inlineStyles.borderRadius || "18px";
            break;

        case "icon-glass":
            variantStyles = "h-[42px] w-[42px] border-0 bg-white/20 text-[20px] text-white backdrop-blur-[10px] hover:bg-white/30 active:scale-95 disabled:opacity-50";
            inlineStyles.borderRadius = inlineStyles.borderRadius || "50%";
            break;

        case "view-toggle":
            inlineStyles.borderRadius = inlineStyles.borderRadius || "18px";
            if (active) {
                variantStyles = "h-[58px] w-[58px] bg-[#2155CD] text-white text-[24px] shadow-[0_10px_20px_rgba(33,85,205,0.3)] hover:-translate-y-1";
            } else {
                variantStyles = "h-[58px] w-[58px] bg-white text-[#2155CD] text-[24px] shadow-[0_10px_20px_rgba(0,0,0,0.12)] hover:-translate-y-1 hover:bg-gray-50";
            }
            break;

        case "secondary":
            variantStyles = "h-[52px] px-6 gap-2 text-[16px] text-[#2155CD] bg-[#EEF4FF] hover:bg-[#DCE7FF] rounded-[16px]";
            break;

        case "outline":
            variantStyles = "h-[52px] px-6 gap-2 text-[16px] text-[#2155CD] border-2 border-[#2155CD] bg-transparent hover:bg-[#2155CD] hover:text-white rounded-[16px]";
            break;

        default:
            break;
    }

    const widthClass = fullWidth ? "w-full" : "";

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variantStyles} ${widthClass} ${className}`}
            style={inlineStyles}
            {...restProps}
        >
            {icon && <span className="flex items-center justify-center">{icon}</span>}
            {children}
        </button>
    );
};

export default CustomButton;
