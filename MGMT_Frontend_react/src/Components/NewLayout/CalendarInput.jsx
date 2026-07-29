import React from "react";

/**
 * Helper to safely format a Date object or string to YYYY-MM-DD for standard date input
 */
const formatDateToYYYYMMDD = (val) => {
    if (!val) return "";
    if (val instanceof Date) {
        if (isNaN(val.getTime())) return "";
        const year = val.getFullYear();
        const month = String(val.getMonth() + 1).padStart(2, "0");
        const day = String(val.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }
    if (typeof val === "string") {
        if (val.includes("T")) return val.split("T")[0];
        return val;
    }
    return "";
};

/**
 * CalendarInput Component
 * Styled date input matching the NewLayout design system with full responsiveness.
 * Supports string values ("YYYY-MM-DD") as well as JavaScript Date objects or custom calendar picker children.
 * 
 * @param {Object} props
 * @param {string} [props.label] - Field label text
 * @param {string|Date} [props.value] - Input value (YYYY-MM-DD or Date object)
 * @param {Function} [props.onChange] - Standard change event handler (e) => ...
 * @param {Function} [props.onDateChange] - Direct date change handler (Date | string) => ...
 * @param {string} [props.name] - Input field name
 * @param {string|Date} [props.min] - Minimum date
 * @param {string|Date} [props.max] - Maximum date
 * @param {boolean} [props.required=false] - Mandatory indicator
 * @param {string} [props.className=""] - Wrapper custom class
 * @param {string} [props.inputClassName=""] - Input custom class
 * @param {React.ReactNode} [props.children] - Optional custom date picker element (e.g. CalenderComponent)
 */
export const CalendarInput = ({
    label,
    value,
    onChange,
    onDateChange,
    name,
    min,
    max,
    required = false,
    className = "",
    inputClassName = "",
    children,
    ...restProps
}) => {
    const formattedValue = formatDateToYYYYMMDD(value);
    const formattedMin = formatDateToYYYYMMDD(min);
    const formattedMax = formatDateToYYYYMMDD(max);

    const handleChange = (e) => {
        if (onChange) {
            onChange(e);
        }
        if (onDateChange) {
            const dateVal = e.target.value ? new Date(e.target.value) : null;
            onDateChange(dateVal, e.target.value);
        }
    };

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="mb-2 block text-sm sm:text-base font-semibold text-[#444]">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            {children ? (
                children
            ) : (
                <div className="relative">
                    <input
                        type="date"
                        name={name}
                        value={formattedValue}
                        onChange={handleChange}
                        min={formattedMin || undefined}
                        max={formattedMax || undefined}
                        required={required}
                        className={`h-[52px] w-full rounded-[16px] border border-[#d8d8d8] px-4 text-[#333] bg-white shadow-none transition-all duration-200 focus:border-[#2155CD] focus:outline-none focus:shadow-[0_0_0_.15rem_rgba(33,85,205,.18)] ${inputClassName}`}
                        {...restProps}
                    />
                </div>
            )}
        </div>
    );
};

/**
 * DateRangePicker Component
 * Two responsive date inputs in a grid side-by-side.
 */
export const DateRangePicker = ({
    fromDate,
    toDate,
    onFromChange,
    onToChange,
    fromLabel = "दिनांक पासून",
    toLabel = "दिनांक पर्यंत",
    fromName = "from",
    toName = "to",
    className = "",
}) => {
    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${className}`}>
            <CalendarInput
                label={fromLabel}
                value={fromDate}
                onChange={onFromChange}
                name={fromName}
                max={toDate || undefined}
            />
            <CalendarInput
                label={toLabel}
                value={toDate}
                onChange={onToChange}
                name={toName}
                min={fromDate || undefined}
            />
        </div>
    );
};

export default CalendarInput;
