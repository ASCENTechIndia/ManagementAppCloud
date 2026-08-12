import React, { useRef, useState } from "react";
import { Formik, Form } from "formik";
import { Repeat } from "lucide-react";
import CalenderComponent from "../../Components/CalenderComponent";
import { formatDateForAPI } from "../../utils/dateUtils";
import { useLoader } from "../../Context/LoaderContext";
import { useAuth } from "../../Context/AuthContext";
import apiService from "../../../apiService";
import TableComponent from "../../Components/Table/Table";
import { useNavigate } from "react-router-dom";
import {
  PageHeader,
  FormLayoutCard,
  CalendarInput,
} from "../../Components/NewLayout";
import { ChevronLeft } from "lucide-react";
import useAlert from "../../Components/CustomAlert/useAlert";

const ComplaintSummary = () => {
  const { setLoading } = useLoader();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showAlert, hideAlert, Alert } = useAlert();
  const userId = user?.userId;
  const ulbid = user?.data?.OrgId;
  const tableRef = useRef(null);
  const [currentView, setCurrentView] = useState("summary");
  const [summaryData, setSummaryData] = useState([]);
  const [detailsData, setDetailsData] = useState([]);

  const [selectedFrom, setSelectedFrom] = useState(null);
  const [selectedTo, setSelectedTo] = useState(null);

  const summaryHeaders = [
    "विभागाचे नाव",
    "नोंदणी",
    "निरा करण झालेल्या",
    "बाकी",
    "%",
  ];
  const summaryKeyMapping = {
    "विभागाचे नाव": "departmentName",
    नोंदणी: "registration",
    "निरा करण झालेल्या": "resolved",
    बाकी: "pending",
    "%": "percentage",
  };

  const detailsHeaders = [
    "दिनांक",
    "ग्राहक क्र.",
    "विभागाचे नाव",
    "तक्रार तपशील",
  ];
  const detailsKeyMapping = {
    दिनांक: "compdt",
    "ग्राहक क्र.": "custno",
    "विभागाचे नाव": "comptype",
    "तक्रार तपशील": "compdtl",
  };

  const customCellRenderer = {
    registration: (value, row) => (
      <span
        // className="text-blue-600 underline cursor-pointer"
        // onClick={() => handleCellClick(row.compcode, "R")}
      >
        {value}
      </span>
    ),
    resolved: (value, row) => (
      <span
        // className="text-blue-600 underline cursor-pointer"
        // onClick={() => handleCellClick(row.compcode, "S")}
      >
        {value}
      </span>
    ),
    pending: (value, row) => (
      <span
        // className="text-blue-600 underline cursor-pointer"
        // onClick={() => handleCellClick(row.compcode, "P")}
      >
        {value}
      </span>
    ),
  };

  const fetchSummary = async (from, to) => {
    hideAlert();
    if (!userId || !ulbid) {
      showAlert("UlbId or userId is not set", "warning");
      return;
    }
    try {
      setLoading(true);
      const payload = {
        Request1: `${import.meta.env.VITE_FLAG}$Crm_Complaint$${userId}$${ulbid}~${formatDateForAPI(from)}~${formatDateForAPI(to)}~*~*`,
        Request2: "",
        Request3: "",
        Request4: "",
        Request5: "",
        Request6: "",
        Request7: "",
      };
      const res = await apiService.post("WTgeneric-call", payload);

      if (res?.data?.Success && res?.data?.data?.jsondata?.length > 0) {
        hideAlert();
        const rows = res.data.data.jsondata.map((item) => ({
          departmentName: item.comptype || "",
          compcode: item.compcode || "",
          registration: Number(item.totalcomp) || 0,
          resolved: Number(item.resolved) || 0,
          pending: Number(item.pending) || 0,
          percentage: item.totalcomp
            ? `${((item.resolved / item.totalcomp) * 100).toFixed(2)}%`
            : "0%",
        }));

        // Total row
        const totalRegistration = rows.reduce(
          (sum, r) => sum + r.registration,
          0,
        );
        const totalResolved = rows.reduce((sum, r) => sum + r.resolved, 0);
        const totalPending = rows.reduce((sum, r) => sum + r.pending, 0);
        const overallPercentage = totalRegistration
          ? `${((totalResolved / totalRegistration) * 100).toFixed(2)}%`
          : "0%";

        const totalRow = {
          departmentName: "एकूण",
          compcode: "",
          registration: totalRegistration,
          resolved: totalResolved,
          pending: totalPending,
          percentage: overallPercentage,
        };

        setSummaryData([...rows, totalRow]);
        setCurrentView("summary");
        setTimeout(() => {
          tableRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }, 100);
      } else {
        setSummaryData([]);
        showAlert("Record not found", "error");
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
      setSummaryData([]);
      showAlert(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchDetails = async (compcode, type, from, to) => {
    hideAlert();
    if (!userId || !ulbid) {
      showAlert("UlbId or userId is not set", "warning");
      return;
    }
    try {
      setLoading(true);
      const payload = {
        Request1: `PropMAMC$Crm_Complaint$${userId}$${ulbid}~${formatDateForAPI(from)}~${formatDateForAPI(to)}~${compcode}~${type}`,
        Request2: "",
        Request3: "",
        Request4: "",
        Request5: "",
        Request6: "",
        Request7: "",
      };
      const res = await apiService.post("WTgeneric-call", payload);

      if (res?.data?.Success && res?.data?.data?.jsondata?.length > 0) {
        hideAlert();
        const rows = res.data.data.jsondata.map((item) => ({
          compdt: item.compdt || "",
          custno: item.custno || "",
          comptype: item.comptype || "",
          compdtl: item.compdtl || "",
        }));
        setDetailsData(rows);
        setCurrentView("details");
        setTimeout(() => {
          tableRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }, 100);
      } else {
        setDetailsData([]);
        showAlert("No details found", "error");
      }
    } catch (error) {
      console.error("Error fetching details:", error);
      setDetailsData([]);
      showAlert(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setSelectedFrom(values.from);
    setSelectedTo(values.to);
    await fetchSummary(values.from, values.to);
  };

  const handleCellClick = (compcode, type) => {
    if (!selectedFrom || !selectedTo) {
      showAlert("Please fetch summary data first", "warning");
      return;
    }
    if (!compcode) {
      showAlert("No compcode found for this row", "warning");
      return;
    }
    fetchDetails(compcode, type, selectedFrom, selectedTo);
  };

  const handleBackToSummary = () => {
    if (selectedFrom && selectedTo) {
      fetchSummary(selectedFrom, selectedTo);
    } else {
      setCurrentView("summary");
    }
  };

  const handleGoBack = () => {
    navigate("/CADDashboard");
  };

  const isSummaryView = currentView === "summary";
  const currentData = isSummaryView ? summaryData : detailsData;
  const currentHeaders = isSummaryView ? summaryHeaders : detailsHeaders;
  const currentKeyMapping = isSummaryView
    ? summaryKeyMapping
    : detailsKeyMapping;

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      <PageHeader
        title="Complaint Summary"
        subtitle="CRM"
        onBack={handleGoBack}
      />
      <Alert />
      {isSummaryView && (
        <Formik
          initialValues={{ from: new Date(), to: new Date() }}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values, handleSubmit: formikSubmit }) => (
            <Form onSubmit={formikSubmit}>
              <FormLayoutCard
                onSubmit={formikSubmit}
                actionButtonText="पहा"
                actionButtonIcon={<Repeat className="w-5 h-5" />}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CalendarInput label="दिनांक पासून">
                    <CalenderComponent
                      name="from"
                      selectedDate={values.from}
                      autoSelectToday={false}
                      setSelectedDate={(date) => setFieldValue("from", date)}
                    />
                  </CalendarInput>
                  <CalendarInput label="दिनांक पर्यंत">
                    <CalenderComponent
                      name="to"
                      selectedDate={values.to}
                      autoSelectToday={false}
                      setSelectedDate={(date) => setFieldValue("to", date)}
                    />
                  </CalendarInput>
                </div>
              </FormLayoutCard>
            </Form>
          )}
        </Formik>
      )}

      {/* Table Section */}
      <section className="container mx-auto mt-4 mb-5 px-4" ref={tableRef}>
        <div className="rounded-3xl bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
          {!isSummaryView && (
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

          {/* Table or "No record" message */}
          {currentData.length > 0 ? (
            <TableComponent
              data={currentData}
              headers={currentHeaders}
              keyMapping={currentKeyMapping}
              customCellRenderer={isSummaryView ? customCellRenderer : {}}
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

export default ComplaintSummary;
