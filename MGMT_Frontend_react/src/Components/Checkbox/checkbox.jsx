import React from "react";

const Checkbox = ({ label, checked, onChange, id }) => {
  return (
    <Form.Check
      type="checkbox"
      id={id}
      label={label}
      checked={checked}
      onChange={onChange}
      className="form-check"
    />
  );
};

export default Checkbox;
