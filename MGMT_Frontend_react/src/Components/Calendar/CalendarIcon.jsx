
import React, { useState, useEffect } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CalendarIcon.css";

const CalendarIcon = ({
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

  // Set default selected date to today if none is selected
useEffect(() => {
  if (!selectedDate && autoSelectToday) {
    setSelectedDate(today);
    // Optional chaining to prevent crash if not passed
    if (typeof setFieldValue === "function") {
      setFieldValue("startDate", today); // 🛠️ Also update Formik
    }
  }
}, [selectedDate, setSelectedDate, autoSelectToday]);


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
    <div className="textbox-container position-relative d-flex align-items-center">
      <div className="input-group w-100">
        <input
          type="text"
          className="form-control p-2"
          placeholder={placeholder}
         value={
          selectedDate instanceof Date
            ? selectedDate.toLocaleDateString("en-GB")
            : selectedDate           // maybe it’s already a formatted string
              ? new Date(selectedDate).toLocaleDateString("en-GB")
              : ""
        }

          readOnly
          disabled={disabled || isDateLocked} 
          onClick={toggleDatePicker}
        />

        <span
          className={`input-group-text ${isDateLocked ? "disabled" : ""}`}
          onClick={toggleDatePicker}
          style={{ cursor: disabled || isDateLocked ? "not-allowed" : "pointer", }}
        >
          <img
            src="https://img.icons8.com/ios/50/000000/calendar.png"
            alt="calendar-icon"
            style={{
              width: "20px",
              height: "20px",
              opacity: disabled || isDateLocked ? 0.5 : 1,
            }}
          />
        </span>
      </div>

      {isOpen && (
        <div className="datepicker-modal position-absolute bg-white p-2 shadow rounded">
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

export default CalendarIcon;