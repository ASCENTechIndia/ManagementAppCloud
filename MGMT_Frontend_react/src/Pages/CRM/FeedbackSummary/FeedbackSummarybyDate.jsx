import React, { useState, useEffect } from "react";
import Table from "../../../Components/Table/Table";
import { useNavigate, useLocation } from "react-router-dom";
import InputField from "../../../Components/InputField/InputField";
import { Field, ErrorMessage, Form, Formik } from "formik";
import Header from "../../../HOC/Header/Header";
import { Table as TableIcon, PieChart, BarChart3 } from "lucide-react";
import { useLoader } from "../../../Context/LoaderContext";
import { useAuth } from "../../../Context/AuthContext";
import apiService from "../../../../apiService";

const FeedbackSummarybyDate = () => {
 const { setLoading } = useLoader();
      const navigate = useNavigate();
          const { user } = useAuth();
          const userid = user?.userId || "";
  const [tableData, setTableData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [barGraphData, setBarGraphData] = useState([]);
  const [activeView, setActiveView] = useState("table");
  const location = useLocation();
  const wardName = location.state?.wardName || "";
  const wardId = location.state?.wardId || "";

    const handleGoBack = () => {
   navigate("/informationandfeedback");
  };

    const headers = ["Citizen Name", "Phone Number", "Email", "Notice", "Date"];

     useEffect(() => {
      if (!userid || !wardId) return;
  const fetchData = async () => {
    try {
        setLoading(true);
      const response = await apiService.post("generic-call", {
        Request1: `MobApp$PrabhagWise_Collection$${userid}$1~${wardId}`,
        Request2: "",
        Request3: "",
        Request4: "",
        Request5: "",
        Request6: "",
        Request7: "",
      });

      if (response.data?.data?.jsondata) {
        const res = response.data.data.jsondata;

        // 🔹 Format table data
        const formattedData = res.map((item) => ({
          zone: item.zone_name,
          mvalue: item.arrears,
          cvalue: item.current,
          tvalue: item.total,
          zoneId: item.zone_id,
        }));

        // 🔹 Calculate total row
            const totalRow = formattedData.reduce(
        (acc, cur) => {
            acc.mvalue += Number(cur.mvalue) || 0;
            acc.cvalue += Number(cur.cvalue) || 0;
            acc.tvalue += Number(cur.tvalue) || 0;
            return acc;
        },
        {
            zone: "Total",
            mvalue: 0,
            cvalue: 0,
            tvalue: 0,
        }
        );
       totalRow.mvalue = totalRow.mvalue.toFixed(2);
        totalRow.cvalue = totalRow.cvalue.toFixed(2);
        totalRow.tvalue = totalRow.tvalue.toFixed(2);
        setTableData([...formattedData, totalRow]);


        // 🔹 Pie Chart Data
        setPieChartData(
          res.map((item) => ({
            name: item.zone_name,
            y: item.total,
          }))
        );
console.log("Pie chart data →", pieChartData);
        // 🔹 Bar Chart Data
     setBarGraphData(
  res.map((item) => ({
    category: item.zone_name,
    previous: Number(item.arrears) || 0,
    current: Number(item.current) || 0,
    total: Number(item.total) || 0,
  }))
);
      }
    } catch (error) {
      console.error("Error fetching MIS data:", error);
    }finally{
        setLoading(false);
    }
  };

  fetchData();
}, [userid, wardId]);

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-3">
        <Header
            title="Feedback Summary"
            subtitle="CRM"
            onBack={handleGoBack}
          />
            <div className="w-full max-w-[720px] mx-auto p-2">
                <div className="my-3 rounded-2xl overflow-hidden bg-white">
           <Table
  headers={headers}
  data={tableData}
  keyMapping={{
    Zone: "zone",
    Arrears: "mvalue",
    Current: "cvalue",
    Total: "tvalue",
  }}
  customCellRenderer={{
     zone: (value, row) => {
      // 🧠 if it's the "Total" row, just render plain text
      if (value === "Total") {
        return (
          <span style={{ fontWeight: "bold" }}>
            {value}
          </span>
        );
      }

      // 🟦 otherwise make it clickable
      return (
        <span
          style={{
            color: "#007bff",
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onClick={() =>
            navigate("/TaxCollectionWardWiseinBlock", {
              state: { zoneId: row.zoneId, zoneName: row.zone, wardId, wardName },
            })
          }
        >
          {value}
        </span>
      );
    },
  }}
/>
            </div>
        </div>
        </div>
    );
};

export default FeedbackSummarybyDate;