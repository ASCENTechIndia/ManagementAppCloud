import React from 'react';
import PropTypes from 'prop-types';

const Label = ({ text, required, className = '', style }) => {
  return (
    <label
      className={`block font-semibold text-gray-800 mb-1 ${className}`}
      style={style}
    >
      {text}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

Label.propTypes = {
  text: PropTypes.node.isRequired,
  required: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};

Label.defaultProps = {
  required: false,
  className: '',
  style: {},
};

export default Label;
