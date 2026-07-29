import React, { useEffect, useState } from "react";
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

const PendingReportOne = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const navigate = useNavigate();
  const { setLoading } = useLoader();
  const [initialView, setInitialView] = useState(false);

  const [tableHeader, setTableHeader] = useState([
    "विभागाचे नाव",
    "बाकी",
    "निराकरण झालेल्या",
    "एकूण",
    "Auto Escalation",
  ]);
  const [tableKeyMapping, setTableKeyMapping] = useState({
    "विभागाचे नाव": "label1",
    बाकी: "label2",
    "निराकरण झालेल्या": "label3",
    एकूण: "label4",
    "Auto Escalation": "label5",
  });
  const [chartData, setChartData] = useState([]);
  const [tableData, setTableData] = useState([
    {
      label1: "test",
      label2: "test",
      label3: "test",
      label4: "test",
      label5: "test",
    },
    {
      label1: "test",
      label2: "test",
      label3: "test",
      label4: "test",
      label5: "test",
    },
    {
      label1: "test",
      label2: "test",
      label3: "test",
      label4: "test",
      label5: "test",
    },
  ]);
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

  const fetchData = async () => {
    try {
      setLoading(true);
      const payload = {};
      const res = await apiService.post("", payload);
      console.log("result :", res);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

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
          <TableComponent
            data={tableData}
            headers={tableHeader}
            keyMapping={tableKeyMapping}
          />
        </div>
      </div>
    </div>
  );
};

export default PendingReportOne;
