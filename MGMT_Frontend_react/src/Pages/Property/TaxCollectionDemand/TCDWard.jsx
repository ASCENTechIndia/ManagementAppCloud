import React, { useState, useEffect, useRef } from "react";
import Table from "../../../Components/Table/Table";
import { useNavigate, useLocation } from "react-router-dom";
import { Table as TableIcon, PieChart, BarChart3 } from "lucide-react";
import PieChartComponent from "../Tax/PieChartComponent";
import StackedBarGraph from "../../../Components/StackedBarGraph";
import apiService from "../../../../apiService";
import { useLoader } from "../../../Context/LoaderContext";
import { useAuth } from "../../../Context/AuthContext";
import {
  PageHeader,
  SubHeaderCard,
  CustomButton,
} from "../../../Components/NewLayout";

const TCDWard = () => {
  const { setLoading } = useLoader();
  const { user } = useAuth();
  const userid = user?.userId || "";
  const orgId = user?.data?.OrgId;
  const navigate = useNavigate();
  const location = useLocation();
  const { zone_id, wardName, zoneName, ward_id } = location.state || {};

  const [activeView, setActiveView] = useState("table");
  const [tableHeader, setTableHeader] = useState(["ब्लॉक", "मागील", "चालू", "एकूण"]);
  const [tableData, setTableData] = useState([]);
  const tableRef = useRef(null);
  const pieRef = useRef(null);
  const barRef = useRef(null);
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [seriesConfig, setSeriesConfig] = useState([]);

  const handleGoBack = () => {
    navigate("/propertydashboard");
  };

  const fetchBlocks = async () => {
    try {
      setLoading(true);

      const response = await apiService.post("generic-call", {
        Request1: `MobApp$PrabhagZonewise_Demand$${userid}$${orgId}~${ward_id}~${zone_id}`,
        Request2: "",
        Request3: "",
        Request4: "",
        Request5: "",
        Request6: "",
        Request7: "",
      });

      const result = response?.data?.data?.jsondata || [];

      if (result.length > 0) {
        const mapped = result.map((item) => ({
          blockName: item.block_name?.trim(),
          arrears: parseFloat(item.arrears) || 0,
          current: parseFloat(item.current) || 0,
          total: parseFloat(item.total) || 0,
          zoneId: item.block_id,
        }));

        const totalRow = mapped.reduce(
          (acc, cur) => {
            acc.arrears += cur.arrears;
            acc.current += cur.current;
            acc.total += cur.total;
            return acc;
          },
          { blockName: "एकूण", arrears: 0, current: 0, total: 0 }
        );

        totalRow.arrears = Number(totalRow.arrears.toFixed(2));
        totalRow.current = Number(totalRow.current.toFixed(2));
        totalRow.total = Number(totalRow.total.toFixed(2));

        setTableData([...mapped, totalRow]);

        setPieData(
          mapped.map((item) => ({
            name: item.blockName,
            y: item.total,
          }))
        );

        setBarData(
          mapped.map((item) => ({
            category: item.blockName,
            arrears: item.arrears,
            current: item.current,
          }))
        );

        setSeriesConfig([
          { name: "मागील", key: "arrears", color: "#3b82f6" },
          { name: "चालू", key: "current", color: "#10b981" },
        ]);

        tableRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center"
        })
      }
    } catch (err) {
      console.error("Error fetching blocks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!ward_id || !zone_id) return;
    fetchBlocks();
  }, [zone_id, ward_id]);

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      <PageHeader
        title="Wardwise Tax Demand"
        subtitle="Property Tax"
        onBack={handleGoBack}
      />

      <SubHeaderCard
        subtitle="Block"
        title={
          <span>
            <span
              className="text-white/80 cursor-pointer hover:underline"
              onClick={() => navigate("/TCDPrabhag", { state: { ward_id, wardName } })}
            >
              {wardName}
            </span>
            {zoneName ? ` / ${zoneName}` : ""}
          </span>
        }
        infoText="Yearly Demand (All amounts are shown in lakhs)"
        className="mt-4"
      />

      <section className="container mx-auto mt-4 px-4">
        <div className="flex justify-center gap-4">
          <CustomButton
            variant="view-toggle"
            active={activeView === "table"}
            onClick={() => {
              setActiveView("table");
              tableRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center"
              })
            }}
            icon={<TableIcon className="w-6 h-6" />}
            title="Table View"
          />

          <CustomButton
            variant="view-toggle"
            active={activeView === "pie"}
            onClick={() => {
              setActiveView("pie");
              pieRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center"
              })
            }}
            icon={<PieChart className="w-6 h-6" />}
            title="Pie Chart View"
          />

          <CustomButton
            variant="view-toggle"
            active={activeView === "bar"}
            onClick={() => {
              setActiveView("bar");
              barRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center"
              })
            }}
            icon={<BarChart3 className="w-6 h-6" />}
            title="Bar Chart View"
          />
        </div>
      </section>

      <section className="container mx-auto mt-4 mb-5 px-4" ref={tableRef}>
        <div className="rounded-[24px] bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
          {/* {activeView === "table" && ( */}
          <Table
            headers={tableHeader}
            data={tableData}
            keyMapping={{
              ब्लॉक: "blockName",
              मागील: "arrears",
              चालू: "current",
              एकूण: "total",
            }}
            pagination={true}
            rowsPerPage={10}
          />
          {/* )}  */}
        </div>
      </section>

      <section className="container mx-auto mt-4 mb-5 px-4" ref={pieRef}>
        <div className="rounded-[24px] bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
          {/* {activeView === "pie" &&  */}
          <PieChartComponent data={pieData} />
          {/* // }  */}
        </div>
      </section>

      <section className="container mx-auto mt-4 mb-5 px-4" ref={barRef}>
        <div className="rounded-[24px] bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
          {/* {activeView === "bar" && ( */}
          <StackedBarGraph
            data={barData}
            yAxisTitle="रक्कम (₹ लाखात)"
            seriesConfig={seriesConfig}
          />
          {/* )} */}
        </div>
      </section>
    </div>
  );
};

export default TCDWard;

