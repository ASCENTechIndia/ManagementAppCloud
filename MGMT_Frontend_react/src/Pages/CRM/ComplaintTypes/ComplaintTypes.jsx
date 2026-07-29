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

const ComplaintTypes = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const navigate = useNavigate();
  const { setLoading } = useLoader();
  const [initialView, setInitialView] = useState(false);
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
        setChartData(bothChartData);
        setBarGraphData(bothChartData);
      } else {
        setTableData([]);
        setBarGraphData([]);
        setChartData([]);
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

                  {initialView && (
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div>
                        <p className="text-2xl font-semibold">All Wards</p>
                        <p className="text-blue-800 font-semibold">
                          {formatDateForAPI(values.from)} -{" "}
                          {formatDateForAPI(values.to)}
                        </p>
                        <p className="text-md text-red-500">
                          {"(* दोन तारखे मधील अंतर ७ दिवसापेक्षा जास्त नसावे)"}
                        </p>
                      </div>
                      <div className="flex justify-start md:justify-end items-center gap-2 mt-4 lg:mt-0">
                        <button
                          className={`px-4 py-3 border flex items-center justify-center rounded-lg hover:cursor-pointer gap-2 transition-all duration-200 ${
                            activeView === "table"
                              ? "bg-blue-500 text-white border-blue-500"
                              : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                          }`}
                          type="button"
                          onClick={() => setActiveView("table")}
                        >
                          <TableIcon className="w-5 h-5" />
                        </button>

                        <button
                          className={`px-4 py-3 border flex items-center justify-center rounded-lg hover:cursor-pointer gap-2 transition-all duration-200 ${
                            activeView === "pie"
                              ? "bg-green-500 text-white border-green-500"
                              : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                          }`}
                          type="button"
                          onClick={() => setActiveView("pie")}
                        >
                          <PieChart className="w-5 h-5" />
                        </button>

                        <button
                          className={`px-4 py-3 border flex items-center justify-center rounded-lg hover:cursor-pointer gap-2 transition-all duration-200 ${
                            activeView === "bar"
                              ? "bg-purple-500 text-white border-purple-500"
                              : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                          }`}
                          type="button"
                          onClick={() => setActiveView("bar")}
                        >
                          <BarChart3 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </Form>
              );
            }}
          </Formik>
        </div>

        {initialView && (
          <div className="my-3 rounded-2xl overflow-hidden bg-white">
            {activeView === "table" && (
              <TableComponent
                data={tableData}
                headers={tableHeader}
                keyMapping={tableKeyMapping}
              />
            )}

            {activeView === "pie" && (
              <PieChartComp
                data={chartData}
                title="Tax"
                description="Tax report"
              />
            )}

            {activeView === "bar" && (
              <BarGraphComponent
                data={barGraphData}
                title="Wardwise Daily Collection"
                description="Daily collection report"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintTypes;
