import React, { useState } from "react";
import { Field, Form, Formik } from "formik";
import Label from "../../../Components/Label/Label";
import TableComponent from "../../../Components/TableComponent";
import { Table as TableIcon, PieChart, BarChart3 } from "lucide-react";
import { Repeat } from "lucide-react";
import CalenderComponent from "../../../Components/CalenderComponent";
import { formatDateForAPI } from "../../../utils/dateUtils";
import apiService from "../../../../apiService";
import PieChartComp from "../../../Components/PieChart";
import BarGraphComponent from "../../../Components/BarGraphComponent";
import Header from "../../../HOC/Header/Header";
import { useLoader } from "../../../Context/LoaderContext";
import { useAuth } from "../../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const ComplaintType = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const navigate = useNavigate();
  const { setLoading } = useLoader();
  const [initialView, setInitialView] = useState(false);
  const [descriptionTable, setDescriptionTable] = useState([
    { key: "CON", value: "बांधकाम विभाग" },
    { key: "ATI", value: "अतिक्रमण विभाग," },
    { key: "PWD", value: "बांधकाम विभाग" },
    { key: "PRT", value: "घरपट्टी विभाग" },
    { key: "ELC", value: "विद्युत विभाग" },
  ]);
  const [tableHeader, setTableHeader] = useState([
    "Ward",
    "Arrears",
    "Current",
    "Total",
  ]);
  const [tableKeyMapping, setTableKeyMapping] = useState({
    Ward: "ward_name",
    Arrears: "arrears",
    Current: "current",
    Total: "total",
  });
  const [chartData, setChartData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [barGraphData, setBarGraphData] = useState([]);
  const [initialValues, setInitialValues] = useState({
    from: new Date(),
    to: new Date(),
  });

  const [activeView, setActiveView] = useState("table");

  const handleSubmit = async (values) => {
    if (!userId) {
      alert("UserId is not set");
      return;
    }
    try {
      setLoading(true);
      const payload = {
        Request1: `MobApp$MIS_DailyCollPrabhag$${userId}$1~${formatDateForAPI(
          values.from
        )}~${formatDateForAPI(values.to)}`,
        Request2: "",
        Request3: "",
        Request4: "",
        Request5: "",
        Request6: "",
        Request7: "",
      };
      const res = await apiService.post("generic-call", payload);
      if (
        Array.isArray(res?.data?.data?.jsondata) &&
        res?.data?.data?.jsondata?.length > 0
      ) {
        setInitialView(true);
        const data = res?.data?.data?.jsondata.map((data) => ({
          ward_name: data.ward_name,
          arrears: data.Arrears,
          current: data.Current,
          total: data.total,
        }));
        setTableData(data);
        const bothChartData = data.map((data) => ({
          value: Number(data.total),
          label: data.ward_name,
        }));
        setBarGraphData(bothChartData);
      } else {
        setTableData([]);
        setBarGraphData([]);
        alert("No data found");
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/cms");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-3">
      <Header
        title="Wardwise Daily Collection"
        subtitle="Water Tax"
        onBack={handleGoBack}
      />
      <div className="w-full max-w-[720px] mx-auto px-3 sm:px-4 lg:px-0">
        <div className="bg-white my-3 p-3 sm:p-4 rounded-2xl">
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {({ setFieldValue, values }) => {
              return (
                <Form className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-4">
                      <Label text="दिनांक पासून" />
                      <CalenderComponent
                        name="from"
                        selectedDate={values.from}
                        autoSelectToday={false}
                        setSelectedDate={(date) => {
                          setFieldValue("from", date);
                        }}
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <Label text="दिनांक पर्यंत" />
                      <CalenderComponent
                        name="to"
                        selectedDate={values.to}
                        autoSelectToday={false}
                        setSelectedDate={(date) => {
                          setFieldValue("to", date);
                        }}
                      />
                    </div>

                    <div className="sm:col-span-4 flex justify-center md:justify-end items-end">
                      <button
                        className="px-3 py-2 flex items-center justify-center border border-gray-300 rounded-lg hover:cursor-pointer bg-blue-600 text-white hover:bg-blue-700 gap-1"
                        type="submit"
                      >
                        <Repeat className="w-4 h-4 text-white" />
                        <p className="text-sm sm:text-base">पहा</p>
                      </button>
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>

        {initialView && barGraphData.length > 0 && (
          <div>
            <div className="my-3 rounded-2xl overflow-hidden bg-white">
              <BarGraphComponent
                data={barGraphData}
                title="Wardwise Daily Collection"
                description="Daily collection report"
              />
            </div>
            <div className="my-3 rounded-2xl overflow-hidden bg-white">
              <div className="p-4">
                <div className="border text-center py-3 font-semibold text-xl">
                  Description
                </div>
                {descriptionTable.map((item) => {
                  return (
                    <div className="grid grid-cols-2 py-3 border">
                      <div className="text-center">{item.key}</div>
                      <div className="text-center">{item.value}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintType;
