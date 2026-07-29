import React, { useState, useEffect, useRef } from "react";
import { useLoader } from "../../Context/LoaderContext";
import { useAuth } from "../../Context/AuthContext";
import apiService from "../../../apiService";
import TableComponent from "../../Components/Table/Table";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../Components/NewLayout";
import axios from "axios";

const ComplaintGrvRpt = () => {
  const { setLoading } = useLoader();
  const { user } = useAuth();
  const navigate = useNavigate();
  const ulbId = user?.data?.OrgId;
  const tableRef = useRef(null);
  const [tableData, setTableData] = useState([]);

  const tableHeaders = [
    "Sr. No.",
    "Department Name",
    "Total Complaint",
    "Pending Complaint",
    "Work Assigned",
    "Closed Complaint",
  ];
  const tableKeyMapping = {
    "Sr. No.": "srNo",
    "Department Name": "deptName",
    "Total Complaint": "total",
    "Pending Complaint": "pending",
    "Work Assigned": "assigned",
    "Closed Complaint": "closed",
  };

  useEffect(() => {
    if (ulbId) {
      fetchData();
    }
  }, [ulbId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_CRM_BASE_URL}/getComplaintDepartmentStats?ulbId=${ulbId}`,
      );
      let data = response.data;

      if (data.length > 0) {
        const rows = data.map((item) => ({
          srNo: item.ROWNUM || "",
          deptName: item.DEPTNAME || "",
          total: item.TOTAL_CNT || 0,
          pending: item.PENDING_FOR_ASSIGN || 0,
          assigned: item.ASSIGNED || 0,
          closed: item.CLOSED || 0,
        }));
        setTableData(rows);
        setTimeout(() => {
          tableRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }, 100);
      } else {
        alert("Record not available");
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching complaint report:", error);
      setTableData([]);
      alert(error.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/CADDashboard");
  };

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      <PageHeader
        title="Complaint Report"
        subtitle="CRM"
        onBack={handleGoBack}
      />

      <section className="container mx-auto mt-4 mb-5 px-4" ref={tableRef}>
        <div className="rounded-3xl bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
          {tableData.length > 0 ? (
            <TableComponent
              data={tableData}
              headers={tableHeaders}
              keyMapping={tableKeyMapping}
              pagination={true}
              rowsPerPage={10}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              No record available
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ComplaintGrvRpt;
