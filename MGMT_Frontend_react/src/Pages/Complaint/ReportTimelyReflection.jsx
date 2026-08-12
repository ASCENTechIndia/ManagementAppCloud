import React, { useState, useEffect, useRef } from "react";
import { useLoader } from "../../Context/LoaderContext";
import { useAuth } from "../../Context/AuthContext";
import apiService from "../../../apiService";
import TableComponent from "../../Components/Table/Table";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../Components/NewLayout";
import { ChevronLeft } from "lucide-react";
import useAlert from "../../Components/CustomAlert/useAlert";

const ReportTimelyReflection = () => {
  const { setLoading } = useLoader();
  const { user } = useAuth();
  const { showAlert, hideAlert, Alert } = useAlert();
  const userId = user?.userId;
  const ulbid = user?.data?.OrgId;
  const navigate = useNavigate();
  const tableRef = useRef(null);
  const [currentView, setCurrentView] = useState("summary");
  const [tableData, setTableData] = useState([]);

  const summaryHeaders = ["विभागाचे नाव", "बाकी"];
  const summaryKeyMapping = {
    "विभागाचे नाव": "departmentName",
    बाकी: "pending",
  };

  const detailsHeaders = [
    "तक्राराची क्रमांक",
    "ग्राहकाचे नाव",
    "दिनांक व वेळ",
    "TAT",
  ];
  const detailsKeyMapping = {
    "तक्राराची क्रमांक": "complaintNumber",
    "ग्राहकाचे नाव": "custName",
    "दिनांक व वेळ": "date",
    TAT: "tat",
  };

  const fetchSummary = async () => {
    hideAlert();
    if (!userId || !ulbid) {
      showAlert("User Id or ulbid is not set", "warning");
      return;
    }
    try {
      setLoading(true);
      const payload = {
        Request1: `PropMAMC$Crm_Escalationsummary$${userId}$${ulbid}~`,
        Request2: "",
        Request3: "",
        Request4: "",
        Request5: "",
        Request6: "",
        Request7: "",
      };
      const res = await apiService.post("WTgeneric-call", payload);
      console.log("res ", res);
      if (res?.data?.Success && res?.data?.data?.length > 0) {
        hideAlert();
        const strArr = res.data.data.split("|");
        const data = strArr.map((item) => {
          const [id, deptName, pending] = item.split("$");
          return {
            departmentName: (
              <p
                className="underline text-blue-500 cursor-pointer"
                onClick={() => fetchDetails(id)}
              >
                {deptName}
              </p>
            ),
            pending,
          };
        });
        const totalPending = data.reduce((sum, item) => sum += Number(item.pending), 0)
        const totalRow = {
          departmentName: "Total",
          pending: totalPending
        }
        setTableData([...data, totalRow]);
        setCurrentView("summary");
        setTimeout(() => {
          tableRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }, 100);
      } else {
        setTableData([]);
        setCurrentView("summary");
        showAlert("No Data Found", "error");
      }
    } catch (error) {
      console.error("Error fetching summary data:", error);
      setTableData([]);
      showAlert(error.message || "Failed to fetch data", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchDetails = async (deptId) => {
    hideAlert();
    if (!userId || !ulbid) {
      showAlert("User Id or ulbid is not set", "warning");
      return;
    }
    try {
      setLoading(true);
      const payload = {
        Request1: `${import.meta.env.VITE_FLAG}$Crm_Escalationsummdtls$${userId}$${ulbid}~${deptId}`,
        Request2: "",
        Request3: "",
        Request4: "",
        Request5: "",
        Request6: "",
        Request7: "",
      };
      const res = await apiService.post("WTgeneric-call", payload);
      if (res?.data?.Success && res?.data?.data?.length > 0) {
        hideAlert();
        const strArr = res.data.data.split("|");
        const data = strArr.map((item) => {
          const [id, compNum, custName, date, time, tat] = item.split("$");
          return {
            complaintNumber: compNum,
            custName: custName,
            date: `${date} ${time}`,
            tat: tat,
          };
        });
        setTableData(data);
        setCurrentView("details");
        setTimeout(() => {
          tableRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }, 100);
      } else {
        setTableData([]);
        showAlert("No details found", "error");
      }
    } catch (error) {
      console.error("Error fetching details:", error);
      setTableData([]);
      showAlert(error.message || "Failed to fetch details", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ulbid && userId) {
      fetchSummary();
    }
  }, [userId, ulbid]);

  const handleGoBack = () => {
    navigate("/CADDashboard");
  };

  const handleBackToSummary = () => {
    fetchSummary();
  };

  const currentHeaders =
    currentView === "details" ? detailsHeaders : summaryHeaders;
  const currentKeyMapping =
    currentView === "details" ? detailsKeyMapping : summaryKeyMapping;

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      <PageHeader
        title="Report Timely Reflection"
        subtitle="CRM"
        onBack={handleGoBack}
      />
      <Alert />
      <section className="container mx-auto mt-4 mb-5 px-4" ref={tableRef}>
        <div className="rounded-3xl bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
          {tableData.length > 0 ? (
            <>
              {currentView === "details" && (
                <div className="mb-4 flex items-center">
                  <button
                    onClick={handleBackToSummary}
                    className="flex items-center text-blue-500 hover:text-blue-700 transition-colors font-medium"
                  >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Back to Summary
                  </button>
                </div>
              )}

              <TableComponent
                data={tableData}
                headers={currentHeaders}
                keyMapping={currentKeyMapping}
                pagination={true}
                rowsPerPage={10}
              />
            </>
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

export default ReportTimelyReflection;
