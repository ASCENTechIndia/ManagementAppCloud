import React from "react";
import PropTypes from "prop-types";
import "bootstrap-icons/font/bootstrap-icons.css";

const SubHeader = ({ title, subtitle, onBack }) => {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-violet-400 to-violet-600 text-white shadow-lg p-3 flex items-center gap-2">
      {onBack && (
        <button
          onClick={onBack}
          className="bg-white/20 hover:bg-white/30 text-white rounded-md p-1 transition"
        >
          <i className="bi bi-chevron-left text-lg"></i>
        </button>
      )}
      <div className="font-bold text-lg">{title}</div>
      {subtitle && <div className="ml-auto text-sm opacity-90">{subtitle}</div>}
    </header>
  );
};

SubHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  onBack: PropTypes.func, // Optional back button handler
};

export default SubHeader;
