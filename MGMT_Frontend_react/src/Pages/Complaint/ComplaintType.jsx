import React, { useRef, useState } from "react";
import { Formik, Form } from "formik";
import { Repeat } from "lucide-react";
import CalenderComponent from "../../Components/CalenderComponent";
import { formatDateForAPI } from "../../utils/dateUtils";
import { useLoader } from "../../Context/LoaderContext";
import { useAuth } from "../../Context/AuthContext";
import apiService from "../../../apiService";
import TableComponent from "../../Components/Table/Table"; // 👈 changed
import { useNavigate } from "react-router-dom";
import {
  PageHeader,
  FormLayoutCard,
  CalendarInput,
} from "../../Components/NewLayout";

const ComplaintType = () => {
  const { setLoading } = useLoader();
  const { user } = useAuth();
  const navigate = useNavigate();
  const userId = user?.userId;
  const ulbid = user?.data?.OrgId;
  const tableRef = useRef(null);
  const [tableData, setTableData] = useState([]);
  const [initialValues] = useState({
    from: new Date(),
    to: new Date(),
  });

  const tableHeaders = [
    "दिनांक",
    "ग्राहक क्र.",
    "विभागाचे नाव",
    "तक्रार तपशील",
  ];
  const tableKeyMapping = {
    "दिनांक": "compdt",
    "ग्राहक क्र.": "custno",
    "विभागाचे नाव": "comptype",
    "तक्रार तपशील": "compdtl",
  };

  const fetchData = async (from, to) => {
    if (!userId || !ulbid) {
      alert("User id or UlbID not found");
      return;
    }
    try {
      setLoading(true);
      const payload = {
        Request1: `${import.meta.env.VITE_FLAG}$Crm_ComplaintDet$${userId}$${ulbid}~${formatDateForAPI(from)}~${formatDateForAPI(to)}`,
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
          compdt: item.compdt || "",
          custno: item.custno || "",
          comptype: item.comptype || "",
          compdtl: item.compdtl || "",
        }));
        setTableData(rows);
        setTimeout(() => {
          tableRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }, 100);
      } else {
        alert("No record available");
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching complaint data:", error);
      setTableData([]);
      alert(error.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (values) => {
    fetchData(values.from, values.to);
  };

  const handleGoBack = () => {
    navigate("/CADDashboard");
  };

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      <PageHeader title="Complaint Type" subtitle="CRM" onBack={handleGoBack} />

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

      <section className="container mx-auto mt-4 mb-5 px-4" ref={tableRef}>
        <div className="rounded-3xl bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
          {tableData.length > 0 ? (
            <TableComponent
              data={tableData}
              headers={tableHeaders}
              keyMapping={tableKeyMapping}
              rowsPerPage={10}
              pagination={true}
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

export default ComplaintType;