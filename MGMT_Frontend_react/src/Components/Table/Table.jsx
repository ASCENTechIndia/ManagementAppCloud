

import React, { useState } from "react";
import "./Table.css";
import { useNavigate } from "react-router-dom";
import FileUpload from "../FileUpload/FileUpload";

const Table = ({
  headers = [],
  data = [],
  keyMapping = {},
  onCheckboxChange,
  onRadioChange,
  onDownload,
  onInputChange,
  onFileUpload,
  onSelectAllChange,
  showCheckboxInHeader = true,
  customCellRenderer = {},
  columnStyles = {},
  pagination = false,
  rowsPerPage = 5,
}) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const isAllChecked = data.length > 0 && data.every((row) => !!row.checked);

  // Pagination Logic
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginatedData = pagination
    ? data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    : data;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="table-container">
      <table className="table table-bordered">
        <thead className="custom-thead">
          <tr>
            {headers.map((header, index) => {
              const key = keyMapping[header];
              if (key === "checked" && showCheckboxInHeader) {
                return (
                  <th key={index} className="table-header">
                    <input
                      type="checkbox"
                      checked={isAllChecked}
                      onChange={(e) =>
                        onSelectAllChange && onSelectAllChange(e.target.checked)
                      }
                    />
                  </th>
                );
              }
              return (
                <th key={index} className="table-header" style={columnStyles[header] || {}}>
                  {header}
                </th>
              );
            })}
          </tr>
        </thead>

    <tbody>
  {paginatedData.length > 0 ? (
    paginatedData.map((row, rowIndex) => {
      const isTotalRow = Object.values(row).some(
  (val) => val === "एकूण" || val === "Total"
);

      return (
        <tr
          key={rowIndex}
          className={`table-row ${isTotalRow ? "total-highlight" : ""}`} // 👈 apply class
        >
          {headers.map((header, colIndex) => {
            const key = keyMapping[header];
            const value = row[key];

            if (customCellRenderer[key]) {
              return (
                <td key={colIndex} className="table-cell">
                  {customCellRenderer[key](value, row, rowIndex)}
                </td>
              );
            }

            return (
              <td key={colIndex} className="table-cell">
                {value !== undefined && value !== null ? value : "-"}
              </td>
            );
          })}
        </tr>
      );
    })
  ) : (
    <tr>
      <td
        colSpan={headers.length}
        className="no-data text-center fw-bold text-danger"
      >
        No records found.
      </td>
    </tr>
  )}
</tbody>


      </table>

      {/* Pagination Controls */}
      {pagination && totalPages > 1 && (
        <div className="pagination d-flex justify-content-center mt-4 mb-4 gap-2">
          <button
            className="btn btn-outline-primary"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="align-self-center">Page {currentPage} of {totalPages}</span>
          <button
            className="btn btn-outline-primary"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;
