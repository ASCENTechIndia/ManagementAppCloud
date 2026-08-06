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

const ServiceWiseDetails = () => {
  const { setLoading } = useLoader();
  const { user } = useAuth();
  const navigate = useNavigate();
  const tableRef = useRef(null);
  const userId = user?.userId;
  const ulbid = user?.data?.OrgId;

  const [tableData, setTableData] = useState([]);
  const [selectedFrom, setSelectedFrom] = useState(new Date());
  const [selectedTo, setSelectedTo] = useState(new Date());

  const tableHeaders = [
    "Service Name",
    "New",
    "Approved",
    "Delivered",
    "Application Received",
    "Auth Pending",
    "Auth Reject",
    "Auth Accept Pending",
    "Payment Pending",
    "Total",
    "Certificate Upload",
    "Certificate Pending",
    "ULB Pending",
    "Citizen Payment Receipt",
    "Payment Generate",
    "Auth Accepted",
  ];
  const tableKeyMapping = {
    "Service Name": "service_name",
    New: "new",
    Approved: "approved",
    Delivered: "delivered",
    "Application Received": "application_received",
    "Auth Pending": "authorisation_pending",
    "Auth Reject": "authorisation_reject",
    "Auth Accept Pending": "authorisation_accpt_pending",
    "Payment Pending": "payment_pending",
    Total: "total",
    "Certificate Upload": "certificate_iss_upload",
    "Certificate Pending": "certificate_iss_pending",
    "ULB Pending": "ulb_pending",
    "Citizen Payment Receipt": "citizen_payment_reciept",
    "Payment Generate": "payment_generate",
    "Auth Accepted": "authorisation_accpt",
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
    if (!userId || !ulbid) {
      alert("User ID or Ulb ID not found");
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

      if (
        res?.data?.Success &&
        res?.data?.data?.jsondata &&
        Array.isArray(res.data.data.jsondata) &&
        res.data.data.jsondata.length > 0
      ) {
        const rows = res.data.data.jsondata.map((item) => ({
          service_name: item.service_name || "",
          new: Number(item.new) || 0,
          approved: Number(item.approved) || 0,
          delivered: Number(item.delivered) || 0,
          application_received: Number(item.application_received) || 0,
          authorisation_pending: Number(item.authorisation_pending) || 0,
          authorisation_reject: Number(item.authorisation_reject) || 0,
          authorisation_accpt_pending: Number(item.authorisation_accpt_pending) || 0,
          payment_pending: Number(item.payment_pending) || 0,
          total: Number(item.total) || 0,
          certificate_iss_upload: Number(item.certificate_iss_upload) || 0,
          certificate_iss_pending: Number(item.certificate_iss_pending) || 0,
          ulb_pending: Number(item.ulb_pending) || 0,
          citizen_payment_reciept: Number(item.citizen_payment_reciept) || 0,
          payment_generate: Number(item.payment_generate) || 0,
          authorisation_accpt: Number(item.authorisation_accpt) || 0,
        }));

        // Calculate Totals Row
        const totalRow = {
          service_name: "एकूण",
          new: rows.reduce((acc, cur) => acc + cur.new, 0),
          approved: rows.reduce((acc, cur) => acc + cur.approved, 0),
          delivered: rows.reduce((acc, cur) => acc + cur.delivered, 0),
          application_received: rows.reduce((acc, cur) => acc + cur.application_received, 0),
          authorisation_pending: rows.reduce((acc, cur) => acc + cur.authorisation_pending, 0),
          authorisation_reject: rows.reduce((acc, cur) => acc + cur.authorisation_reject, 0),
          authorisation_accpt_pending: rows.reduce((acc, cur) => acc + cur.authorisation_accpt_pending, 0),
          payment_pending: rows.reduce((acc, cur) => acc + cur.payment_pending, 0),
          total: rows.reduce((acc, cur) => acc + cur.total, 0),
          certificate_iss_upload: rows.reduce((acc, cur) => acc + cur.certificate_iss_upload, 0),
          certificate_iss_pending: rows.reduce((acc, cur) => acc + cur.certificate_iss_pending, 0),
          ulb_pending: rows.reduce((acc, cur) => acc + cur.ulb_pending, 0),
          citizen_payment_reciept: rows.reduce((acc, cur) => acc + cur.citizen_payment_reciept, 0),
          payment_generate: rows.reduce((acc, cur) => acc + cur.payment_generate, 0),
          authorisation_accpt: rows.reduce((acc, cur) => acc + cur.authorisation_accpt, 0),
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
        alert("No data found for the selected dates");
      }
    } catch (error) {
      console.error("Error fetching service-wise data:", error);
      setTableData([]);
      alert(error.message || "Failed to fetch data");
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
