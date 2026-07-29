import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Components/Table/Table.css";

const TableComponent = ({
  headers = [],
  data = [],
  keyMapping = {},
  columnStyles = {},
  firstColumnClickable = false,
  pagination = false,
  rowsPerPage = 5,
  onCellClick,
}) => {
  const navigate = useNavigate();
  const [ward_Id, setWard_Id] = useState();
  const [total, setTotal] = useState({ arrears: 0, current: 0, total: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginatedData = pagination
    ? data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    : data;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleCellClick = (rowIndex, header, cellValue, wardId, zoneId) => {
    if (header === headers[0]) {
      onCellClick && onCellClick(cellValue, rowIndex, wardId, zoneId);
    }
  };

  useEffect(() => {
    if (data.length > 0) {
      const result = data.reduce(
        (acc, obj) => {
          acc.arrears += Number(obj.arrears);
          acc.current += Number(obj.current);
          acc.total += Number(obj.total);
          return acc;
        },
        { arrears: 0, current: 0, total: 0 }
      );
      setTotal({
        arrears: result.arrears.toFixed(2),
        current: result.current.toFixed(2),
        total: result.total.toFixed(2),
      });
    }
  }, [data]);

  return (
    <div className="table-container">
      <table className=" m-0">
        <thead className="custom-thead">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="table-header"
                style={columnStyles[header] || {}}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((row, rowIndex) => {
              return (
                <tr key={rowIndex} className="table-row">
                  {headers.map((header, colIndex) => {
                    const key = keyMapping[header];
                    const cellValue = row[key];

                    if (key === "select") {
                      return (
                        <td key={colIndex} className="table-cell">
                          <a
                            className="update-button"
                            style={{
                              textDecoration: "none",
                              color: "#007bff",
                              cursor: "pointer",
                            }}
                            onClick={() => navigate(row.updateLink)}
                          >
                            {row.updateLabel || "select"}
                          </a>
                        </td>
                      );
                    }

                    return (
                      <td
                        key={colIndex}
                        className={`table-cell ${
                          firstColumnClickable && colIndex === 0
                            ? "text-blue-500 underline cursor-pointer"
                            : ""
                        } `}
                        style={columnStyles[header] || {}}
                        onClick={() =>
                          colIndex === 0 &&
                          handleCellClick(
                            rowIndex,
                            header,
                            cellValue,
                            row?.ward_id,
                            row?.zone_id
                          )
                        }
                      >
                        {cellValue !== undefined && cellValue !== null
                          ? cellValue
                          : "-"}
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

          {/* Calculate the last row Total value */}
          {paginatedData.length > 0 && (
            <tr>
              <td
                className="table-cell"
                style={{
                  backgroundColor: "#cddcfe",
                  color: "#000",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Total
              </td>
              <td
                className="table-cell"
                style={{
                  backgroundColor: "#cddcfe",
                  color: "#000",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {total.arrears}
              </td>
              <td
                className="table-cell"
                style={{
                  backgroundColor: "#cddcfe",
                  color: "#000",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {total.current}
              </td>
              <td
                className="table-cell"
                style={{
                  backgroundColor: "#cddcfe",
                  color: "#000",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {total.total}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {pagination && totalPages > 1 && (
        <div className="pagination d-flex justify-content-center mt-4 mb-4 gap-2">
          <button
            className="btn btn-outline-primary"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="align-self-center">
            Page {currentPage} of {totalPages}
          </span>
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

export default TableComponent;
