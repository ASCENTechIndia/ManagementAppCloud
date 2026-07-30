import React, { useRef, useState } from "react";
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

const SearchInformation = () => {
  const { setLoading } = useLoader();
  const { user } = useAuth();
  const navigate = useNavigate();
  const tableRef = useRef(null);

  const userId = user?.userId;
  const ulbid = user?.data?.OrgId;

  const [tableData, setTableData] = useState([]);
  const [selectedFrom, setSelectedFrom] = useState(new Date());
  const [applicationNumber, setApplicationNumber] = useState("");

  const tableHeaders = ["दिनांक", "पती / पत्नीचे नाव", "प्रमाणपत्र"];
  const tableKeyMapping = {
    दिनांक: "appdate",
    "पती / पत्नीचे नाव": "husbwifename",
    प्रमाणपत्र: "certiprint",
  };

  const initialValues = {
    from: new Date(),
    applicationNumber: "",
  };

  const formatDateDisplay = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleString("en", { month: "short" });
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = async (values) => {
    const appNo = values.applicationNumber.trim();
    if (!appNo) {
      alert("Please enter application number");
      return;
    }

    if (!userId || !ulbid) {
      alert("User ID or Ulb Id not found");
      return;
    }

    setSelectedFrom(values.from);
    setApplicationNumber(appNo);

    try {
      setLoading(true);
      const payload = {
        Request1: `${import.meta.env.VITE_FLAG}$Mrrg_Search$${userId}$${ulbid}~${formatDateForAPI(values.from)}~${appNo}`,
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
          appdate: item.appdate || "",
          husbwifename: item.husbwifename || "",
          certiprint: item.certiprint || "",
        }));
        setTableData(rows);
        setTimeout(() => {
          tableRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }, 100);
      } else {
        setTableData([]);
        alert("No data found for the selected date and application number");
      }
    } catch (error) {
      console.error("Error fetching search information:", error);
      setTableData([]);
      alert(error.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/Marriage");
  };

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      <PageHeader
        title="Search Information"
        subtitle="Marriage"
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
                <CalendarInput label="विवाह दिनांक">
                  <CalenderComponent
                    name="from"
                    selectedDate={values.from}
                    autoSelectToday={false}
                    setSelectedDate={(date) => {
                      setFieldValue("from", date);
                    }}
                  />
                </CalendarInput>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    अर्ज क्रमांक
                  </label>
                  <input
                    type="text"
                    name="applicationNumber"
                    value={values.applicationNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setFieldValue("applicationNumber", val);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                    placeholder="फक्त संख्या"
                  />
                </div>
              </div>
            </FormLayoutCard>
          </Form>
        )}
      </Formik>

      {tableData.length > 0 && (
        <>
          <SubHeaderCard
            subtitle="Marriage"
            title="Search Information"
            infoText={`From ${formatDateDisplay(selectedFrom)} | अर्ज क्रमांक: ${applicationNumber}`}
            className="mt-4"
          />

          <section className="container mx-auto mt-4 mb-5 px-4" ref={tableRef}>
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

export default SearchInformation;