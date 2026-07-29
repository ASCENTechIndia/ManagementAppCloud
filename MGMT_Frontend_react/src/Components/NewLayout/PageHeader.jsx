import React from "react";
import { BsArrowLeft, BsBell, BsPersonCircle } from "react-icons/bs";
import CustomButton from "./CustomButton";
import HeaderUserButton from "./HeaderUserButton";
import { useAuth } from "../../Context/AuthContext";

/**
 * PageHeader Component
 * Gradient header matching the NewLayout design system with responsive title and action buttons.
 * 
 * @param {Object} props
 * @param {string} [props.title="Property Dashboard"] - Header title
 * @param {string} [props.subtitle="Welcome Back"] - Small subtitle above title
 * @param {boolean} [props.showBack=true] - Whether to show back arrow button
 * @param {Function} [props.onBack] - Handler for back button
 * @param {Function} [props.onNotificationClick] - Handler for notification button
 * @param {Function} [props.onProfileClick] - Handler for profile button
 * @param {React.ReactNode} [props.rightActions] - Custom node to replace/augment right action buttons
 * @param {string} [props.className=""] - Additional custom Tailwind classes
 */
const PageHeader = ({
    title = "Property Dashboard",
    subtitle = "Welcome Back",
    showBack = true,
    onBack,
    onNotificationClick,
    onProfileClick,
    rightActions,
    className = "",
}) => {
    const { logout } = useAuth();
    return (
        <header
            className={`bg-gradient-to-br from-[#0F3FAE] to-[#3D71F5] px-4 sm:px-6 pt-[20px] sm:pt-[25px] pb-[40px] sm:pb-[45px] rounded-b-[25px] sm:rounded-b-[30px] text-white shadow-[0_12px_30px_rgba(0,0,0,0.12)] ${className}`}
        >
            <div className="container mx-auto flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                    {subtitle && (
                        <small className="block text-xs sm:text-sm text-white/70 font-medium tracking-wide">
                            {subtitle}
                        </small>
                    )}

                    <h2 className="text-xl sm:text-2xl font-bold truncate tracking-tight mt-0.5">
                        {title}
                    </h2>
                </div>

                <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                    {rightActions ? (
                        rightActions
                    ) : (
                        <>
                            {showBack && (
                                <CustomButton
                                    variant="icon-glass"
                                    onClick={onBack || (() => window.history.back())}
                                    title="Go back"
                                >
                                    <BsArrowLeft size={20} />
                                </CustomButton>
                            )}

                            {/* <CustomButton
                                variant="icon-glass"
                                onClick={onNotificationClick}
                                title="Notifications"
                            >
                                <BsBell size={20} />
                            </CustomButton> */}

                            {/* <CustomButton
                                variant="icon-glass"
                                onClick={onProfileClick}
                                title="Profile"
                            >
                                <BsPersonCircle size={20} />
                            </CustomButton> */}
                            <HeaderUserButton logOut={logout} />
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default PageHeader;
