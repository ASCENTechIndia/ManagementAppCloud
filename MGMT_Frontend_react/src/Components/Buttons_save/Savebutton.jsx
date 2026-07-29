import React from "react";
import { Link } from "react-router-dom";
import "./SaveButton.css";

const SaveButton = ({
  text,
  to,
  onClick,
  customClass = "",
  type = "button",
  loading = false,
  disabled = false,
  icon = "bi-check2-circle", // ✅ Added icon as a prop with a default value
}) => {
  const buttonContent = (
    <>
      {loading && (
        <span
          className="spinner-border spinner-border-sm me-2"
          role="status"
          aria-hidden="true"
        ></span>
      )}
      {/* ✅ Use dynamic icon here */}
      <i className={`${icon} me-2`}></i> {text}
    </>
  );

  return to ? (
    <Link to={to} className={`save-button ${customClass}`}>
      {buttonContent}
    </Link>
  ) : (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`save-button ${customClass}`}
    >
      {buttonContent}
    </button>
  );
};

export default SaveButton;
