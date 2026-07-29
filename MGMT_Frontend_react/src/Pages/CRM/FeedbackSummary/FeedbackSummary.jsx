import React, { useState, useEffect } from "react";
import { Field, Form, Formik } from "formik";
import Label from "../../../Components/Label/Label";
import Table from "../../../Components/Table/Table";
import { Table as TableIcon, PieChart, BarChart3 } from "lucide-react";
import { Repeat } from "lucide-react";
import CalenderComponent from "../../../Components/CalenderComponent";
import "../../Property/Daily/style.css";
import { formatDateForAPI } from "../../../utils/dateUtils";
import apiService from "../../../../apiService";
import PieChartComp from "../../../Components/PieChart";
import BarGraphComponent from "../../../Components/BarGraphComponent";
import Header from "../../../HOC/Header/Header";
import { useLoader } from "../../../Context/LoaderContext";
import { useAuth } from "../../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import PieChartComponent from "../../Property/Tax/PieChartComponent";
import StackedBarGraph from "../../../Components/StackedBarGraph";

const FeedbackSummary = () => {
  const { setLoading } = useLoader();
  const { user } = useAuth();
  const userId = user?.userId;
  const navigate = useNavigate();
  const [pieChartData, setPieChartData] = useState([]);
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
  const [formDate, setFormDate] = useState({
    from: new Date(),
    to: new Date(),
  });
  const [chartData, setChartData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [barGraphData, setBarGraphData] = useState([]);
  const [ward_Id, setWard_Id] = useState();
  const [initialValues, setInitialValues] = useState({
    from: new Date(),
    to: new Date(),
  });

  const [activeView, setActiveView] = useState("table");
  const [selectedPath, setSelectedPath] = useState(["All Wards"]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [dataCache, setDataCache] = useState({});

  const headers = ["Date", "Count"];

  // dummy data generator based on selected dates
 const generateDummyData = (fromDate, toDate) => {
  const formatDate = (date) =>
    typeof date === "string"
      ? date
      : new Date(date).toISOString().split("T")[0]; // ensure string format

  // 🔹 Dummy table data
  const dummy = [
    { date: formatDate(fromDate), count: 12 },
    { date: formatDate(toDate), count: 18 },
    { date: "2025-10-29", count: 25 },
    { date: "2025-10-28", count: 30 },
  ];

  // 🔹 Set table data
  setTableData(dummy);

  // 🔹 Dummy Pie Chart data
  const dummyPie = [
    { name: "Zone A", y: 45 },
    { name: "Zone B", y: 30 },
    { name: "Zone C", y: 25 },
  ];
  setPieChartData(dummyPie);

  console.log("Pie chart data →", dummyPie);

  // 🔹 Dummy Bar Graph data
  const dummyBar = [
    { category: "Zone A", previous: 10, current: 20, total: 30 },
    { category: "Zone B", previous: 15, current: 10, total: 25 },
    { category: "Zone C", previous: 5, current: 25, total: 30 },
  ];
  setBarGraphData(dummyBar);
};

  useEffect(() => {
    // Automatically load data when date changes
    generateDummyData(formDate.from, formDate.to);
  }, [formDate]);

  const handleGoBack = () => {
    navigate("/informationandfeedback");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-3">
      <Header title="Feedback Summary" subtitle="CRM" onBack={handleGoBack} />
      <div className="w-full max-w-[720px] mx-auto px-3 sm:px-4 lg:px-0">
        <div className="bg-white my-3 p-3 sm:p-4 rounded-2xl">
          <Formik initialValues={initialValues} >
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
                          setFormDate((prev) => ({ ...prev, from: date }));
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
                          setFormDate((prev) => ({ ...prev, to: date }));
                          setFieldValue("to", date);
                        }}
                      />
                    </div>

                 
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <div>
                  <p className="text-md text-gray-600 text-center mt-4">
 ( दिनांक {" "}
  <span className="font-semibold text-blue-700">
    {values.from ? new Date(values.from).toLocaleDateString("en-GB") : "-"}
  </span>{" "}
  ते{" "}
  <span className="font-semibold text-blue-700">
    {values.to ? new Date(values.to).toLocaleDateString("en-GB") : "-"} )
  </span>
</p>

                    </div>
          
                    <div className="flex items-center gap-2">
                      <button
                        className={`px-4 py-3 border flex items-center justify-center rounded-lg gap-2 transition-all duration-200 ${
                          activeView === "table"
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                        }`}
                        onClick={() => setActiveView("table")}
                      >
                        <TableIcon className="w-5 h-5" />
                      </button>
          
                      <button
                        className={`px-4 py-3 border flex items-center justify-center rounded-lg gap-2 transition-all duration-200 ${
                          activeView === "pie"
                            ? "bg-green-500 text-white border-green-500"
                            : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                        }`}
                        onClick={() => setActiveView("pie")}
                      >
                        <PieChart className="w-5 h-5" />
                      </button>
          
                      <button
                        className={`px-4 py-3 border flex items-center justify-center rounded-lg gap-2 transition-all duration-200 ${
                          activeView === "bar"
                            ? "bg-purple-500 text-white border-purple-500"
                            : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                        }`}
                        onClick={() => setActiveView("bar")}
                      >
                        <BarChart3 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
            <div className="my-3 rounded-2xl overflow-hidden bg-white">
               {activeView === "table" && (
        <Table
          headers={headers}
          data={tableData}
          keyMapping={{
            Date: "date",
            Count: "count",
          }}
          customCellRenderer={{
            count: (value) => (
              <span
      style={{
        color: "#007bff",
        fontWeight: "500",
        cursor: "pointer",
        // textDecoration: "underline",
      }}
      onClick={() =>
        navigate("/feedbacksummarybydate", {
        //   state: { date: row.date, count: value }, // 👈 Pass details to next page
        })
      }
    >
      {value}
    </span>
            ),
          }}
        />
                  )}
                    {activeView === "pie" && (
            <PieChartComponent
              data={pieChartData}
            //   title="Tax"
            //   description="Tax report"
            />
          )}

          {activeView === "bar" && (
                 <StackedBarGraph
  data={barGraphData}
  // title="प्रभागनिहाय मालमत्ता"
  // description="रहिवासी व व्यापारी मालमत्तांची तुलना"
  yAxisTitle="Amount"
  seriesConfig={[
    { name: "Arrears", key: "previous", color: "#3b82f6" },   // Residential
    { name: "Current", key: "current", color: "#10b981" },   // Non-Residential
    // { name: "Total", key: "total", color: "#f59e0b" },         // Total (optional)
  ]}
/>
          )}
        </div>
        
                </Form>
              );
            }}
          </Formik>
      
        </div>

   
      </div>
    </div>
  );
};

export default FeedbackSummary;
