import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CalenderComponent from "../../Components/CalenderComponent";
import { formatDateForAPI } from "../../utils/dateUtils";
import { useLoader } from "../../Context/LoaderContext";
import { useAuth } from "../../Context/AuthContext";
import apiService from "../../../apiService";
import Table from "../../Components/Table/Table";
import { PageHeader,  FormLayoutCard,
  CalendarInput, } from "../../Components/NewLayout";
import { Formik, Form } from "formik";
import { Repeat } from "lucide-react";
import useAlert from "../../Components/CustomAlert/useAlert";


const Department = () => {
  const { setLoading } = useLoader();
  const { user } = useAuth();
  const tableRef = useRef(null);
  const navigate = useNavigate();
  const { showAlert, hideAlert, Alert } = useAlert();
  const userId = user?.userId;
  const ulbid = user?.data?.OrgId;

  const [tableData, setTableData] = useState([]);
  const [selectedFrom, setSelectedFrom] = useState(new Date());
  const [selectedTo, setSelectedTo] = useState(new Date());
  const initialValues = {
    from: new Date(),
    to: new Date(),
  };
  const tableHeaders = [
    "विभागाचे नाव",
    "पूर्ण",
    "प्रलंबित",
    "नाकारलेले",
    "एकूण",
  ];
  const tableKeyMapping = {
    "विभागाचे नाव": "department_name",
    पूर्ण: "completed",
    प्रलंबित: "pending",
    नाकारलेले: "reject",
    एकूण: "total",
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
        Request1: `${import.meta.env.VITE_FLAG}$rts_departwise_summary$${userId}$${ulbid}~${formatDateForAPI(values.from)}~${formatDateForAPI(values.to)}`,
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
        hideAlert();
        const rows = res.data.data.jsondata.map((item) => ({
          department_name: item.department_name || "",
          completed: Number(item.completed) || 0,
          pending: Number(item.pending) || 0,
          reject: Number(item.reject) || 0,
          total: Number(item.total) || 0,
        }));

        // Calculate Totals Row
        const totalCompleted = rows.reduce((acc, cur) => acc + cur.completed, 0);
        const totalPending = rows.reduce((acc, cur) => acc + cur.pending, 0);
        const totalReject = rows.reduce((acc, cur) => acc + cur.reject, 0);
        const totalTotal = rows.reduce((acc, cur) => acc + cur.total, 0);

        const totalRow = {
          department_name: "एकूण",
          completed: totalCompleted,
          pending: totalPending,
          reject: totalReject,
          total: totalTotal,
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
        showAlert("No Data Found", "error");
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setTableData([]);
      showAlert(error.message || "Failed to fetch data", "error");
    } finally {
      setLoading(false);
    }
  };

  const customCellRenderer = {
    department_name: (value) => {
      if (value === "एकूण" || value === "Total") {
        return <span className="font-bold text-gray-900">{value}</span>;
      }
      return <span>{value}</span>;
    },
  };

  // useEffect(() => {
  //   if (userId && ulbid) {
  //     fetchData();
  //   }
  // }, [userId, ulbid]);

  const handleGoBack = () => {
    navigate("/RTS");
  };

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      <PageHeader
        title="Department Wise Summary"
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
            title="Department Wise Summary"
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

export default Department;
