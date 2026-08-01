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

const TrackApplication = () => {
  const { setLoading } = useLoader();
  const { user } = useAuth();
  const tableRef = useRef(null);
  const navigate = useNavigate();
  const userId = user?.userId;
  const ulbid = user?.data?.OrgId;

  const [tableData, setTableData] = useState([]);
  const [submittedApp, setSubmittedApp] = useState("");

  const tableHeaders = ["अर्ज क्रमांक", "अर्ज दिनांक", "स्थिती"];
  const tableKeyMapping = {
    "अर्ज क्रमांक": "applino",
    "अर्ज दिनांक": "applidt",
    स्थिती: "status",
  };

  const initialValues = {
    appNumber: "",
  };

  const fetchTrackApplication = async (values) => {
    const appNo = values.appNumber.trim();
    if (!appNo) {
      alert("कृपया अर्ज क्रमांक प्रविष्ट करा");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        Request1: `${import.meta.env.VITE_FLAG}$track_application$${userId}$${ulbid}~${appNo}`,
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
        const rows = res.data.data.jsondata.map((item) => ({
          applino: item.applino || "",
          applidt: item.applidt || "",
          status: item.status || "",
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
        alert("No data found for this application number");
      }
    } catch (error) {
      console.error("Error fetching track application:", error);
      setTableData([]);
      alert(error.message || "Failed to fetch data");
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
        title="Track Application"
        subtitle="Market Department"
        onBack={handleGoBack}
      />

      <Formik initialValues={initialValues} onSubmit={fetchTrackApplication}>
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
                    placeholder="उदा. MK1212"
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
            title="Track Application"
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

export default TrackApplication;
