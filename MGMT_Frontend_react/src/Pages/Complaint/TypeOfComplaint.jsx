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

const TypeOfComplaint = () => {
  const { setLoading } = useLoader();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showAlert, hideAlert, Alert } = useAlert(); 
  const userId = user?.userId;
  const ulbid = user?.data?.OrgId;
  const tableRef = useRef(null);
  const [barData, setBarData] = useState([]);
  const [initialValues] = useState({
    from: new Date(),
    to: new Date(),
  });

  const fetchData = async (from, to) => {
    hideAlert();
    if (!userId || !ulbid) {
      showAlert("Userid or ulbID is not set", "warning");
      return;
    }
    try {
      setLoading(true);
      const payload = {
        Request1: `${import.meta.env.VITE_FLAG}$Crm_ComplaintType$${userId}$${ulbid}~${formatDateForAPI(from)}~${formatDateForAPI(to)}~*~COMP`,
        Request2: "",
        Request3: "",
        Request4: "",
        Request5: "",
        Request6: "",
        Request7: "",
      };
      const res = await apiService.post("WTgeneric-call", payload);
      console.log(res);
      if (
        res?.data?.Success &&
        Array.isArray(res?.data?.data?.jsondata) &&
        res.data.data.jsondata.length > 0
      ) {
        hideAlert();
        const data = res.data.data.jsondata.map((item) => ({
          category: item.comptype || "",
          // registered: Number(item.totalcomp) || 0,
          resolved: Number(item.resolved) || 0,
          pending: Number(item.pending) || 0,
        }));
        setBarData(data);
        setTimeout(() => {
          tableRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }, 100);
      } else {
        showAlert("No record available", "error");
        setBarData([]);
      }
    } catch (error) {
      console.error("Error fetching complaint data:", error);
      setBarData([]);
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
        title="Type of Complaint"
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

      {/* Stacked Bar Chart Section */}
      {barData.length > 0 && (
        <section className="container mx-auto mt-4 mb-5 px-4" ref={tableRef}>
          <div className="rounded-3xl bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
            <StackedBarGraph
              data={barData}
              title="Complaint Type-wise Status"
              description="Resolved & Pending"
              yAxisTitle="Number of Complaints"
              seriesConfig={[
                // { name: "Registered", key: "registered", color: "#facc15" },
                { name: "Resolved", key: "resolved", color: "#22c55e" },
                { name: "Pending", key: "pending", color: "#ef4444" },
              ]}
            />
          </div>
        </section>
      )}
    </div>
  );
};

export default TypeOfComplaint;
