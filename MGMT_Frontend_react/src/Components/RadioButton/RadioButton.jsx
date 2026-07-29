import React from "react";
import PropTypes from "prop-types";
import "./RadioButton.css";

const RadioButton = ({ label, name, value, checked, onChange }) => {
  return (
    <label className="inline-block cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="hidden"
      />
      <span
        className={`inline-block px-4 py-2 text-sm border rounded-lg transition-colors duration-200
          ${
            checked
              ? "bg-violet-100 border-violet-300 text-violet-700 font-medium"
              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
      >
        {label}
      </span>
    </label>
  );
};

RadioButton.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

export default RadioButton;
