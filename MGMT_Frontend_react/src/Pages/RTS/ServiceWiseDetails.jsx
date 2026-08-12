import React, { useRef, useState } from "react";
import { Formik, Form } from "formik";
import { Repeat } from "lucide-react";
import CalenderComponent from "../../Components/CalenderComponent";
import { formatDateForAPI } from "../../utils/dateUtils";
import { useLoader } from "../../Context/LoaderContext";
import { useAuth } from "../../Context/AuthContext";
import apiService from "../../../apiService";
import Table from "../../Components/Table/Table";
import { useNavigate } from "react-router-dom";
import {
  PageHeader,
  FormLayoutCard,
  CalendarInput,
  SubHeaderCard,
} from "../../Components/NewLayout";
import useAlert from "../../Components/CustomAlert/useAlert";

const ServiceWiseDetails = () => {
  const { setLoading } = useLoader();
  const { user } = useAuth();
  const navigate = useNavigate();
  const tableRef = useRef(null);
  const { showAlert, hideAlert, Alert } = useAlert();
  const userId = user?.userId;
  const ulbid = user?.data?.OrgId;

  const [tableData, setTableData] = useState([]);
  const [selectedFrom, setSelectedFrom] = useState(new Date());
  const [selectedTo, setSelectedTo] = useState(new Date());

  const tableHeaders = [
    "Service Name",
    "Completed",
    "Pending",
    "Rejected",
    "Total"
    // "New",
    // "Approved",
    // "Delivered",
    // "Application Received",
    // "Auth Pending",
    // "Auth Reject",
    // "Auth Accept Pending",
    // "Payment Pending",
      // "Certificate Upload",
      // "Certificate Pending",
      // "ULB Pending",
      // "Citizen Payment Receipt",
      // "Payment Generate",
      // "Auth Accepted",
  ];
  const tableKeyMapping = {
    "Service Name": "service_name",
    "Completed": "completed",
    "Pending": "pending",
    "Rejected": "rejected",
    "Total": "total"
    // New: "new",
    // Approved: "approved",
    // Delivered: "delivered",
    // "Application Received": "application_received",
    // "Auth Pending": "authorisation_pending",
    // "Auth Reject": "authorisation_reject",
    // "Auth Accept Pending": "authorisation_accpt_pending",
    // "Payment Pending": "payment_pending",
    // Total: "total",
    // "Certificate Upload": "certificate_iss_upload",
    // "Certificate Pending": "certificate_iss_pending",
    // "ULB Pending": "ulb_pending",
    // "Citizen Payment Receipt": "citizen_payment_reciept",
    // "Payment Generate": "payment_generate",
    // "Auth Accepted": "authorisation_accpt",
  };

  const initialValues = {
    from: new Date(),
    to: new Date(),
  };

  const formatDateDisplay = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleString("en", { month: "short" });
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = async (values) => {
    hideAlert();
    if (!userId || !ulbid) {
      showAlert("User ID or Ulb ID not found", "warning");
      return;
    }
    setSelectedFrom(values.from);
    setSelectedTo(values.to);

    try {
      setLoading(true);
      const payload = {
        Request1: `${import.meta.env.VITE_FLAG}$rts_servicewise_summary$${userId}$${ulbid}~${formatDateForAPI(values.from)}~${formatDateForAPI(values.to)}`,
        Request2: "",
        Request3: "",
        Request4: "",
        Request5: "",
        Request6: "",
        Request7: "",
      };
      const res = await apiService.post("WTgeneric-call", payload);
      // console.log(res);
      // return;
      if (
        res?.data?.Success &&
        res?.data?.data?.jsondata &&
        Array.isArray(res.data.data.jsondata) &&
        res.data.data.jsondata.length > 0
      ) {
        hideAlert();
        // console.log(res.data.data.jsondata);
        const rows = res.data.data.jsondata.map((item) => ({
          service_name: item.service_name || "",
          completed: Number(item.completed) || 0,
          pending: Number(item.pending) || 0,
          rejected: Number(item.reject) || 0,
          total: Number(item.total) || 0
        }));

        // Calculate Totals Row
        const totalRow = {
          service_name: "एकूण",
          completed: rows.reduce((sum, arr) => sum += arr.completed, 0),
          pending: rows.reduce((sum, arr) => sum += arr.pending, 0),
          rejected: rows.reduce((sum, arr) => sum += arr.rejected, 0),
          total: rows.reduce((sum, arr) => sum += arr.total, 0),
        };

        setTableData([...rows, totalRow]);

        setTimeout(() => {
          tableRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      } else {
        setTableData([]);
        showAlert("No data found for the selected dates", "error");
      }
    } catch (error) {
      console.error("Error fetching service-wise data:", error);
      setTableData([]);
      showAlert(error.message || "Failed to fetch data", "error");
    } finally {
      setLoading(false);
    }
  };

  const customCellRenderer = {
    service_name: (value) => {
      if (value === "एकूण" || value === "Total") {
        return <span className="font-bold text-gray-900">{value}</span>;
      }
      return <span>{value}</span>;
    },
  };

  const handleGoBack = () => {
    navigate("/RTS");
  };

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      <PageHeader
        title="Service Wise Details"
        subtitle="RTS Department"
        onBack={handleGoBack}
      />
      <Alert />
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
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
                    setSelectedDate={(date) => {
                      setFieldValue("from", date);
                    }}
                  />
                </CalendarInput>

                <CalendarInput label="दिनांक पर्यंत">
                  <CalenderComponent
                    name="to"
                    selectedDate={values.to}
                    autoSelectToday={false}
                    setSelectedDate={(date) => {
                      setFieldValue("to", date);
                    }}
                  />
                </CalendarInput>
              </div>
            </FormLayoutCard>
          </Form>
        )}
      </Formik>

      {tableData.length > 0 && (
        <>
          {/* <SubHeaderCard
            subtitle="RTS Department"
            title="Service Wise Details"
            infoText={`From ${formatDateDisplay(selectedFrom)} To ${formatDateDisplay(selectedTo)}`}
            className="mt-4"
          /> */}

          <section className="container mx-auto mt-4 mb-5 px-4" ref={tableRef}>
            <div className="rounded-3xl bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
              <Table
                data={tableData}
                headers={tableHeaders}
                keyMapping={tableKeyMapping}
                pagination={true}
                rowsPerPage={10}
                customCellRenderer={customCellRenderer}
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default ServiceWiseDetails;
