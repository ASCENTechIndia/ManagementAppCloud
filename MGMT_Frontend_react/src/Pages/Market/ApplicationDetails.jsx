import React, { useRef, useState } from "react";
import { Formik, Form } from "formik";
import { Repeat } from "lucide-react";
import { useLoader } from "../../Context/LoaderContext";
import { useAuth } from "../../Context/AuthContext";
import apiService from "../../../apiService";
import Table from "../../Components/Table/Table";
import { useNavigate } from "react-router-dom";
import {
  PageHeader,
  FormLayoutCard,
  SubHeaderCard,
} from "../../Components/NewLayout";
import useAlert from "../../Components/CustomAlert/useAlert";

const ApplicationDetails = () => {
  const { setLoading } = useLoader();
  const { user } = useAuth();
  const tableRef = useRef(null);
  const navigate = useNavigate();
  const { showAlert, hideAlert, Alert } = useAlert();
  const userId = user?.userId;
  const ulbid = user?.data?.OrgId;

  const [tableData, setTableData] = useState([]);
  const [submittedApp, setSubmittedApp] = useState("");

  const tableHeaders = [
    "अर्ज क्रमांक",
    "अर्ज दिनांक",
    "दुकानाचे नाव",
    "मालकाचे नाव",
    "संपर्क क्र.",
    "प्रभाग",
  ];
  const tableKeyMapping = {
    "अर्ज क्रमांक": "applino",
    "अर्ज दिनांक": "applidate",
    "दुकानाचे नाव": "shopname",
    "मालकाचे नाव": "ownername",
    "संपर्क क्र.": "contactno",
    प्रभाग: "zonename",
  };

  const initialValues = {
    appNumber: "",
  };

  const fetchApplicationDetails = async (values) => {
    hideAlert();
    const appNo = values.appNumber.trim();
    if (!appNo) {
      showAlert("कृपया अर्ज क्रमांक प्रविष्ट करा", "warning");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        Request1: `${import.meta.env.VITE_FLAG}$markt_application_details$${userId}$${ulbid}~${appNo}`,
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
        Array.isArray(res?.data?.data?.jsondata) &&
        res.data.data.jsondata.length > 0
      ) {
        hideAlert();
        const rows = res.data.data.jsondata.map((item) => ({
          applino: item.applino || "",
          applidate: item.applidate || "",
          shopname: item.shopname || "",
          ownername: item.ownername || "",
          contactno: item.contactno || "",
          zonename: item.zonename || "",
        }));

        setTableData(rows);
        setSubmittedApp(appNo);

        setTimeout(() => {
          tableRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      } else {
        setTableData([]);
        showAlert("No data found for this application number", "error");
      }
    } catch (error) {
      console.error("Error fetching application details:", error);
      setTableData([]);
      showAlert(error.message || "Failed to fetch data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/Market");
  };

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      <PageHeader
        title="Application Details"
        subtitle="Market Department"
        onBack={handleGoBack}
      />
      <Alert />
      <Formik initialValues={initialValues} onSubmit={fetchApplicationDetails}>
        {({ setFieldValue, values, handleSubmit: formikSubmit }) => (
          <Form onSubmit={formikSubmit}>
            <FormLayoutCard
              onSubmit={formikSubmit}
              actionButtonText="पहा"
              actionButtonIcon={<Repeat className="w-5 h-5" />}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    अर्ज क्रमांक <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="appNumber"
                    value={values.appNumber}
                    onChange={(e) => setFieldValue("appNumber", e.target.value)}
                    placeholder="उदा. 1256420354805092025"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div></div>
              </div>
            </FormLayoutCard>
          </Form>
        )}
      </Formik>

      {tableData.length > 0 && (
        <>
          {/* <SubHeaderCard
            subtitle="Market Department"
            title="Application Details"
            infoText={`अर्ज क्रमांक: ${submittedApp}`}
            className="mt-4"
          /> */}

          <section className="container mx-auto mt-4 mb-5 px-4" ref={tableRef}>
            <div className="rounded-3xl bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
              <Table
                data={tableData}
                headers={tableHeaders}
                keyMapping={tableKeyMapping}
                rowsPerPage={10}
                pagination={true}
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default ApplicationDetails;
