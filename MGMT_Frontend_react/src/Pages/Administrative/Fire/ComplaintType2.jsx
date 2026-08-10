import React, { useState } from "react";
import { Formik, Form } from "formik";
import { Repeat } from "lucide-react";
import CalenderComponent from "../../../Components/CalenderComponent";
import { formatDateForAPI } from "../../../utils/dateUtils";
import { useLoader } from "../../../Context/LoaderContext";
import { useAuth } from "../../../Context/AuthContext";
import apiService from "../../../../apiService";
import Table from "../../../Components/Table/Table";
import { useNavigate } from "react-router-dom";
import {
  PageHeader,
  FormLayoutCard,
  CalendarInput,
  SubHeaderCard,
} from "../../../Components/NewLayout";
import useAlert from "../../../Components/CustomAlert/useAlert";

const ComplaintType2 = () => {
  const { setLoading } = useLoader();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showAlert, Alert } = useAlert();
  const userId = user?.userId;
  const ulbid = user?.data?.OrgId;

  const [tableData, setTableData] = useState([]);
  const [selectedFrom, setSelectedFrom] = useState(new Date());
  const [selectedTo, setSelectedTo] = useState(new Date());

  const tableHeaders = [
    "Application No.",
    "Application Date",
    "Applicant Name",
    "Mobile Number",
    "Property"
    // "Total Applications",
    // "New",
    // "Renewal",
    // "Verification Pending",
    // "Authorization Pending",
    // "Payment Pending",
    // "Rejected",
    // "Visit Pending",
    // "New Issued",
    // "Renewal Issued",
  ];

  const tableKeyMapping = {
    "Application No.": "appno",
    "Application Date": "appdate",
    "Applicant Name": "appname",
    "Mobile Number": "mobile",
    "Property": "property"
    // "Total Applications": "applications",
    // New: "new",
    // Renewal: "renewal",
    // "Verification Pending": "verifypending",
    // "Authorization Pending": "authpending",
    // "Payment Pending": "paymentpending",
    // Rejected: "reject",
    // "Visit Pending": "visitpending",
    // "New Issued": "newissued",
    // "Renewal Issued": "renewissued",
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
      showAlert("User ID or Ulb ID not found", "warning");
      return;
    }
    setSelectedFrom(values.from);
    setSelectedTo(values.to);

    try {
      setLoading(true);
      const payload = {
        Request1: `${import.meta.env.VITE_FLAG}$fire_applicationdetails$${userId}$${ulbid}~${formatDateForAPI(values.from)}~${formatDateForAPI(values.to)}`,
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
        const rawData = res.data.data.jsondata;

        const rows = rawData.map((item) => ({
          appno: item.appno || "",
          appdate: item.appdate || "",
          appname: item.appname || "",
          applications: Number(item.applications) || 0,
          new: Number(item.new) || 0,
          renewal: Number(item.renewal) || 0,
          verifypending: Number(item.verifypending) || 0,
          authpending: Number(item.authpending) || 0,
          paymentpending: Number(item.paymentpending) || 0,
          reject: Number(item.reject) || 0,
          visitpending: Number(item.visitpending) || 0,
          newissued: Number(item.newissued) || 0,
          renewissued: Number(item.renewissued) || 0,
        }));

        setTableData(rows);
      } else if (res?.data?.Success && res?.data?.errorcode === 9999 && typeof res.data.data === "string") {
        const fixedString = res.data.data.replace(/\r?\n/g, "\\n");
        const parsed = JSON.parse(fixedString);

        const jsonData = parsed.jsondata;

        if (jsonData.length > 0) {
          const rows = jsonData.map((item) => ({
            appno: item.appno || "",
            appdate: item.insdate || "",
            appname: item.appname || "",
            mobile: item.mobile || "",
            property: item.purpose || ""
          }));

          setTableData(rows);
        } else {
          setTableData([]);
          showAlert("No data found", "error");
        }
      }


      else {
        setTableData([]);
        showAlert("No data found", "error");
      }
    } catch (error) {
      console.error("Error fetching complaint data:", error);
      setTableData([]);
      showAlert(error.message || "Failed to fetch data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/Fire");
  };

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      <PageHeader
        title="List of Applications"
        subtitle="Fire Department"
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
            subtitle="Fire Department"
            title="List of Applications"
            infoText={`From ${formatDateDisplay(selectedFrom)} To ${formatDateDisplay(selectedTo)}`}
            className="mt-4"
          /> */}

          <section className="container mx-auto mt-4 mb-5 px-4">
            <div className="rounded-3xl bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
              <Table
                data={tableData}
                headers={tableHeaders}
                keyMapping={tableKeyMapping}
                pagination={true}
                rowsPerPage={10}
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default ComplaintType2;
