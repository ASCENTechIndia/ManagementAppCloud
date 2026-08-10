import React, { useRef, useState } from "react";
import { Formik, Form } from "formik";
import { Repeat } from "lucide-react";
import CalenderComponent from "../../Components/CalenderComponent";
import { formatDateForAPI } from "../../utils/dateUtils";
import { useLoader } from "../../Context/LoaderContext";
import { useAuth } from "../../Context/AuthContext";
import apiService from "../../../apiService";
import StackedBarGraph from "../../Components/StackedBarGraph";
import { useNavigate } from "react-router-dom";
import {
  PageHeader,
  FormLayoutCard,
  CalendarInput,
} from "../../Components/NewLayout";
import useAlert from "../../Components/CustomAlert/useAlert";

const ComplaintDepartmentWise = () => {
  const { setLoading } = useLoader();
  const { user } = useAuth();
  const navigate = useNavigate();
  const userId = user?.userId;
  const ulbId = user?.data?.OrgId;
  const tableRef = useRef(null);
  const [barData, setBarData] = useState([]);
  const [tableDet, setTableDet] = useState([]);
  const [initialValues] = useState({
    from: new Date(),
    to: new Date(),
  });
  const { showAlert, Alert } = useAlert();
  const fetchData = async (from, to) => {
    if (!userId || !ulbId) {
      alert("User ID not found");
      return;
    }
    try {
      setLoading(true);
      const payload = {
        Request1: `${import.meta.env.VITE_FLAG}$Crm_ComplaintDeptwise$${userId}$${ulbId}~${formatDateForAPI(from)}~${formatDateForAPI(to)}`,
        Request2: "",
        Request3: "",
        Request4: "",
        Request5: "",
        Request6: "",
        Request7: "",
      };
      const res = await apiService.post("WTgeneric-call", payload);
      // console.log("department wise :", res);
      if (
        res?.data?.Success &&
        Array.isArray(res?.data?.data?.jsondata) &&
        res.data.data.jsondata.length > 0
      ) {

        const data = res.data.data.jsondata.map((item) => ({
          category: item.dept || "",
          // registered: Number(item.registration) || 0,
          resolved: Number(item.resolved) || 0,
          pending: Number(item.pending) || 0,
        }));

        const det = res.data.data.jsondata.map((item) => ({
          shortName: item.deptcode || "",
          fullName: item.dept || "",
        }));
        setTableDet(det);
        setBarData(data);
        setTimeout(() => {
          tableRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }, 100);
      } else {
        showAlert("No Data Found", "error");
        setBarData([]);
        setTableDet([]);
      }
    } catch (error) {
      console.error("Error fetching complaint data:", error);
      setBarData([]);
      setTableDet([]);
      // alert(error.message || "Failed to fetch data");
      showAlert(error.message || "Failed to fetch data", "error");
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
      <PageHeader
        title="Department Wise Complaint"
        subtitle="CRM"
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

      {/* Stacked Bar Chart and Department Details Table */}
      {barData.length > 0 && (
        <section className="container mx-auto mt-4 mb-5 px-4" ref={tableRef}>
          <div className="rounded-3xl bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
            {/* Chart */}
            <StackedBarGraph
              data={barData}
              title="Department-wise Complaint Status"
              description="Resolved & Pending"
              yAxisTitle="Number of Complaints"
              seriesConfig={[
                // { name: "Registered", key: "registered", color: "#facc15" },
                { name: "Resolved", key: "resolved", color: "#22c55e" },
                { name: "Pending", key: "pending", color: "#ef4444" },
              ]}
            />

            {tableDet.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-700 mb-3">
                  Department Details
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                          Short Name
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                          Full Name
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tableDet.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 border">
                            {item.shortName || "-"}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 border">
                            {item.fullName || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

        </section>
      )}
    </div>
  );
};

export default ComplaintDepartmentWise;
