import React from "react";
import { BsSearch } from "react-icons/bs";
import CustomButton from "./CustomButton";

/**
 * FormLayoutCard Component
 * Overlapping white card layout designed for forms and filters matching NewLayout design.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Form fields or controls
 * @param {Function} [props.onSubmit] - Submit handler for the form
 * @param {string} [props.actionButtonText="Search"] - Action button text
 * @param {React.ReactNode} [props.actionButtonIcon] - Action button icon
 * @param {React.ReactNode} [props.actionButton] - Custom action button override
 * @param {boolean} [props.showActionButton=true] - Toggle display of submit/search button
 * @param {string} [props.className=""] - Extra wrapper class names
 * @param {string} [props.cardClassName=""] - Extra card element class names
 * @param {'div' | 'form'} [props.as='div'] - Element tag ('div' or 'form') to prevent nested <form> warnings
 */
const FormLayoutCard = ({
    children,
    onSubmit,
    actionButtonText = "Search",
    actionButtonIcon = <BsSearch className="text-[18px]" />,
    actionButton,
    showActionButton = true,
    className = "",
    cardClassName = "",
    as = "div",
}) => {
    const Component = as;

    const handleSubmit = (e) => {
        if (as === "form") {
            e.preventDefault();
        }
        if (onSubmit) {
            onSubmit(e);
        }
    };

    return (
        <section className={`container mx-auto px-4 ${className}`}>
            <Component
                onSubmit={as === "form" ? handleSubmit : undefined}
                className={`-mt-[35px] rounded-[28px] bg-white p-5 sm:p-[25px] shadow-[0_12px_30px_rgba(0,0,0,0.12)] transition-all duration-300 ${cardClassName}`}
            >
                {children}

                {showActionButton && (
                    <div className="mt-4">
                        {actionButton ? (
                            actionButton
                        ) : (
                            <CustomButton
                                type="submit"
                                variant="primary"
                                fullWidth
                                icon={actionButtonIcon}
                                onClick={as !== "form" && onSubmit ? onSubmit : undefined}
                            >
                                {actionButtonText}
                            </CustomButton>
                        )}
                    </div>
                )}
            </Component>
        </section>
    );
};

export default FormLayoutCard;
