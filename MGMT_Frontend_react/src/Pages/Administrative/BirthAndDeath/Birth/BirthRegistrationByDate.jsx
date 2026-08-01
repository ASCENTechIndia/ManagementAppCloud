import React, { useRef, useState } from "react";
import { Formik, Form } from "formik";
import { Repeat } from "lucide-react";
import CalenderComponent from "../../../../Components/CalenderComponent";
import { formatDateForAPI } from "../../../../utils/dateUtils";
import { useLoader } from "../../../../Context/LoaderContext";
import { useAuth } from "../../../../Context/AuthContext";
import apiService from "../../../../../apiService";
import Table from "../../../../Components/Table/Table";
import { useNavigate } from "react-router-dom";
import {
  PageHeader,
  FormLayoutCard,
  CalendarInput,
  SubHeaderCard,
} from "../../../../Components/NewLayout";

const BirthRegistrationByDate = () => {
  const { setLoading } = useLoader();
  const { user } = useAuth();
  const navigate = useNavigate();
  const userId = user?.userId;
  const ulbid = user?.data?.OrgId;
  const tableRef = useRef(null);
  const [tableData, setTableData] = useState([]);
  const [selectedFrom, setSelectedFrom] = useState(new Date());
  const [selectedTo, setSelectedTo] = useState(new Date());

  const tableHeaders = ["दिनांक", "अर्ज", "अधिकृत"];
  const tableKeyMapping = {
    दिनांक: "applictndt",
    अर्ज: "birthappcount",
    अधिकृत: "birthauthcount",
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
        Request1: `${import.meta.env.VITE_FLAG}$birthdeath_Summary$${userId}$${ulbid}~${formatDateForAPI(values.from)}~${formatDateForAPI(values.to)}`,
        Request2: "a",
        Request3: "a",
        Request4: "a",
        Request5: "a",
        Request6: "a",
        Request7: "a",
      };
      const res = await apiService.post("WTgeneric-call", payload);

      if (
        res?.data?.Success &&
        Array.isArray(res?.data?.data?.jsondata) &&
        res.data.data.jsondata.length > 0
      ) {
        const rows = res.data.data.jsondata.map((item) => ({
          applictndt: item.applictndt || "",
          birthappcount: Number(item.birthappcount) || 0,
          birthauthcount: Number(item.birthauthcount) || 0,
        }));

        const totalApp = rows.reduce((sum, row) => sum + row.birthappcount, 0);
        const totalAuth = rows.reduce(
          (sum, row) => sum + row.birthauthcount,
          0,
        );

        const totalRow = {
          applictndt: "एकूण",
          birthappcount: totalApp,
          birthauthcount: totalAuth,
        };

        setTableData([...rows, totalRow]);
        setTimeout(() => {
          tableRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }, 100);
      } else {
        setTableData([]);
        alert("No data found for the selected dates");
      }
    } catch (error) {
      console.error("Error fetching birth registration data:", error);
      setTableData([]);
      alert(error.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/Birth");
  };

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      <PageHeader
        title="Birth Registration By Date"
        subtitle="Birth Department"
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
            subtitle="Birth Department"
            title="Birth Registration By Date"
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
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default BirthRegistrationByDate;
