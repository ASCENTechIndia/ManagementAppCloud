import React, { useState, useRef, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { BsChevronDown } from "react-icons/bs";
import "./InputField.css";

const InputField = ({
  field,
  form = {},
  label,
  type = "text",
  options = [],
  placeholder = "",
  styleClass = "",
  readOnly = false,
  disabled = false,
  restrictInput,
  onChange,
  onChangeCustom,
  style = {},
  searchableDropdown = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchText, setSearchText] = useState("");
  const dropdownRef = useRef(null);
  const { name, value } = field;
  // console.log("💡 Rendered field", name, "with value:", value);

  const { errors = {}, touched = {}, setFieldValue } = form;

  const showError = touched[name] && errors[name];

  const handleChange = (e) => {
    if (readOnly || disabled) return;

    const newValue = e.target.value;
    if (typeof restrictInput === "function") {
      restrictInput(e, form.setFieldValue, name);
    } else if (typeof setFieldValue === "function") {
      setFieldValue(name, newValue);
    }
    if (typeof onChange === "function") {
      onChange(e);
    }
  };

  const handleSelect = (option) => {
    setFieldValue(name, option.value);
    if (typeof onChangeCustom === "function") {
      onChangeCustom(
        { target: { name, value: option.value } },
        setFieldValue,
        name
      );
    }
    if (typeof onChange === "function") {
      onChange({ target: { name, value: option.value } });
    }
    setShowDropdown(false);
    setSearchText("");
  };

  const filteredOptions = Array.isArray(options)
    ? options.filter((opt) =>
        (opt?.label || "")
          .toLowerCase()
          .includes((searchText || "").toLowerCase())
      )
    : [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`input-field-wrapper ${styleClass}`} ref={dropdownRef}>
      {label && (
        <label className={`input-label ${isFocused ? "focused" : ""}`}>
          {label}
        </label>
      )}

      <div className="input-container">
        {/* 🔹 Searchable Dropdown */}
        {type === "dropdown" && searchableDropdown ? (
          <div
            className={`input-dropdown ${disabled ? "disabled" : ""}`}
            onClick={() => !disabled && setShowDropdown((prev) => !prev)}
          >
            <div className="dropdown-selected">
              {(Array.isArray(options) &&
                options.find((opt) => opt.value === value)?.label) ||
                placeholder}
              <BsChevronDown className="dropdown-icon" />
            </div>

            {showDropdown && (
              <div
                className="dropdown-list"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="search-wrapper">
                  <input
                    type="text"
                    className="search-input"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search..."
                  />
                </div>
                <ul>
                  {filteredOptions.map((opt, idx) => (
                    <li key={idx} onClick={() => handleSelect(opt)}>
                      {opt.label}
                    </li>
                  ))}
                  {filteredOptions.length === 0 && (
                    <li className="no-option">No options</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        ) : type === "dropdown" ? (
          <>
            <select
              name={name}
              className="input-dropdown form-select"
              value={value ?? ""}
              onChange={(e) => {
                const selectedValue = e.target.value;
                setFieldValue(name, selectedValue);

                if (typeof restrictInput === "function") {
                  restrictInput(e, setFieldValue, name);
                }
                if (typeof onChangeCustom === "function") {
                  onChangeCustom(e, setFieldValue, name);
                }
                if (typeof onChange === "function") {
                  onChange(e);
                }
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={disabled}
            >
              <option value="">{placeholder || "Select an option"}</option>
              {Array.isArray(options) &&
                options.map((option, index) => (
                  <option key={option.value || index} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </select>
            {/* <BsChevronDown className="dropdown-icon" /> */}
          </>
        ) : type === "multi-dropdown" ? (
          <div
            className={`input-dropdown ${disabled ? "disabled" : ""}`}
            onClick={() => !disabled && setShowDropdown((prev) => !prev)}
          >
            {/* <div className="dropdown-selected">
              {(() => {
                if (!value || value.length === 0)
                  return placeholder || "Select options";
                if (Array.isArray(options) && value.length === options.length)
                  return "All Selected";
                if (value.length > 3) return `${value.length} selected`;
                return options
                  .filter((opt) => value.includes(opt.value))
                  .map((opt) => opt.label)
                  .join(", ");
              })()}
              <BsChevronDown className="dropdown-icon" />
            </div> */}
            <div className="dropdown-selected">
              {(() => {
                const validValues = Array.isArray(options)
                  ? value.filter((v) => options.some((opt) => opt.value === v))
                  : [];

                if (validValues.length === 0)
                  return placeholder || "Select options";
 
                if (
                  Array.isArray(options) &&
                  validValues.length === options.length
                )
                  return "All Selected";

                if (validValues.length > 3)
                  return `${validValues.length} selected`;

                return options
                  .filter((opt) => validValues.includes(opt.value))
                  .map((opt) => opt.label)
                  .join(", ");
              })()}
              <BsChevronDown className="dropdown-icon" />
            </div>

            {showDropdown && (
              <div
                className="dropdown-list"
                onClick={(e) => e.stopPropagation()}
              >
                <ul>
                  {options.map((opt, idx) => (
                    <li key={idx}>
                      <input
                        type="checkbox"
                        checked={value.includes(opt.value)}
                        // onChange={() => {
                        //   let newValue = [...value];
                        //   if (newValue.includes(opt.value)) {
                        //     newValue = newValue.filter((v) => v !== opt.value);
                        //   } else {
                        //     newValue.push(opt.value);
                        //   }
                        //   setFieldValue(name, newValue);

                        //   if (typeof onChange === "function") {
                        //     onChange(newValue);
                        //   }
                        // }}
                        onChange={() => {
                          let newValue = [...value];

                          if (newValue.includes(opt.value)) {
                            newValue = newValue.filter((v) => v !== opt.value);
                          } else {
                            newValue.push(opt.value);
                          }
                          const validValues = options.map((o) => o.value);
                          newValue = newValue.filter((v) =>
                            validValues.includes(v)
                          );

                          setFieldValue(name, newValue);

                          if (typeof onChange === "function") {
                            onChange(newValue);
                          }
                        }}
                      />
                      <span style={{ marginLeft: "8px" }}>{opt.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <>
            <input
              {...field}
              type={
                type === "password"
                  ? showPassword
                    ? "text"
                    : "password"
                  : type
              }
              className={`input-field form-control ${
                showError ? "error-border" : ""
              }`}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              readOnly={readOnly}
              disabled={disabled}
              style={{
                ...(readOnly || disabled
                  ? { pointerEvents: "none", backgroundColor: "#f5f5f5" }
                  : {}),
                ...style,
              }}
            />
            {type === "password" && (
              <span
                className="password-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default InputField;
