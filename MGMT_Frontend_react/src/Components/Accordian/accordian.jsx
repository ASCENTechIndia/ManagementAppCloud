import React, { useState } from "react";
import "./accordian.css";
import Table from "../Table/Table";

// AccordionItem.jsx
const AccordionItem = ({ title, content = (<div><p>No Record Found</p></div>), disabled = false, tableHeaders = [], tableData = [], keyMapping = {} }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`accordionItem ${disabled ? "disabled" : ""}`}>
      <div className="accordion-header" onClick={toggleAccordion}>
        <div className="accordion-header-content">
          <span>{title}</span>
          <i className={`arrow ${isOpen ? "up" : "down"}`}></i>
        </div>
      </div>

      <div className={`accordion-content-wrapper ${isOpen ? "show" : ""}`}>
        <div className="accordion-content-inner">
          {tableData.length > 0 ? (
            <Table 
              headers={tableHeaders}
              data={tableData}
              keyMapping={keyMapping}
            />
          ) : (
            content
          )}
        </div>
      </div>
    </div>
  );
};


export default AccordionItem;



