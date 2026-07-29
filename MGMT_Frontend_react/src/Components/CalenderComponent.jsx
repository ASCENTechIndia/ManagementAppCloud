import React, { useState, useEffect, useRef } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CalenderComponent = ({
  selectedDate,
  setSelectedDate,
  placeholder = "DD/MM/YYYY",
  disablePastDates = false,
  isDateLocked = false,
  autoSelectToday = false,
  disabled,
  setFieldValue,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const today = new Date();
  const containerRef = useRef(null);

  useEffect(() => {
    if (!selectedDate && autoSelectToday) {
      setSelectedDate(today);
      if (typeof setFieldValue === "function") {
        setFieldValue("startDate", today);
      }
    }
  }, [selectedDate, setSelectedDate, autoSelectToday]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDatePicker = () => {
    if (!isDateLocked && !disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleDateChange = (date) => {
    if (!isDateLocked && !disabled) {
      setSelectedDate(date);
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className={`flex items-center w-full border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors ${disabled || isDateLocked ? 'opacity-50' : ''}`}>
        <input
          type="text"
          className="w-full p-2 focus:outline-none border-none bg-transparent"
          placeholder={placeholder}
          value={
            selectedDate instanceof Date
              ? selectedDate.toLocaleDateString("en-GB")
              : selectedDate
                ? new Date(selectedDate).toLocaleDateString("en-GB")
                : ""
          }
          readOnly
          disabled={disabled || isDateLocked}
          onClick={toggleDatePicker}
        />

        <button
          type="button"
          className={`p-2 bg-transparent border-l border-gray-300 ${disabled || isDateLocked
            ? "cursor-not-allowed"
            : "cursor-pointer hover:bg-gray-50"
            }`}
          onClick={toggleDatePicker}
          disabled={disabled || isDateLocked}
        >
          <img
            src="https://img.icons8.com/ios/50/000000/calendar.png"
            alt="calendar-icon"
            className="w-5 h-5"
          />
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white p-2 shadow-lg border border-gray-200 rounded-md">
          <ReactDatePicker
            selected={selectedDate || today}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={100}
            minDate={disablePastDates ? today : null}
            maxDate={null}
            disabled={disabled || isDateLocked}
            inline
          />
        </div>
      )}
    </div>
  );
};

export default CalenderComponent;