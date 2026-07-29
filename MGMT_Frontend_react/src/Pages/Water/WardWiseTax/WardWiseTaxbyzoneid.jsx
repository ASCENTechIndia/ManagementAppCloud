import React, { useState, useEffect, useRef } from "react";
import Table from "../../../Components/Table/Table";
import { useNavigate, useLocation } from "react-router-dom";
import { Table as TableIcon, PieChart, BarChart3 } from "lucide-react";
import PieChartComponent from "../../Property/Tax/PieChartComponent";
import { useLoader } from "../../../Context/LoaderContext";
import { useAuth } from "../../../Context/AuthContext";
import apiService from "../../../../apiService";
import StackedBarGraph from "../../../Components/StackedBarGraph";
import {
  PageHeader,
  SubHeaderCard,
  CustomButton,
} from "../../../Components/NewLayout";

const WardWiseTaxbyzoneid = () => {
  const { setLoading } = useLoader();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userid = user?.userId || "";
  const orgId = user?.data?.OrgId;
  const tableRef = useRef(null);
  const pieRef = useRef(null);
  const barRef = useRef(null);
  const [tableData, setTableData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [barGraphData, setBarGraphData] = useState([]);
  const [activeView, setActiveView] = useState("table");
  const location = useLocation();
  const wardName = location.state?.wardName || "";
  const wardId = location.state?.wardId || "";
  const zoneName = location.state?.zoneName || "";
  const zoneId = location.state?.zoneId || "";

  const handleGoBack = () => {
    navigate("/waterdashboard");
  };

  const headers = ["Block", "Arrears", "Current", "Total"];

  useEffect(() => {
    if (!userid || !wardId || !zoneId) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiService.post("WTgeneric-call", {
          Request1: `MobApp$PrabhagWise_Collection$${userid}$${orgId}~${wardId}~${zoneId}`,
          Request2: "",
          Request3: "",
          Request4: "",
          Request5: "",
          Request6: "",
          Request7: "",
        });

        if (response.data?.data?.jsondata) {
          const res = response.data.data.jsondata;

          const formattedData = res.map((item) => ({
            block: item.block_name,
            mvalue: item.arrears,
            cvalue: item.current,
            tvalue: item.total,
            blockId: item.block_id,
          }));

          const totalRow = formattedData.reduce(
            (acc, cur) => {
              acc.mvalue += Number(cur.mvalue) || 0;
              acc.cvalue += Number(cur.cvalue) || 0;
              acc.tvalue += Number(cur.tvalue) || 0;
              return acc;
            },
            {
              block: "Total",
              mvalue: 0,
              cvalue: 0,
              tvalue: 0,
            }
          );
          totalRow.mvalue = totalRow.mvalue.toFixed(2);
          totalRow.cvalue = totalRow.cvalue.toFixed(2);
          totalRow.tvalue = totalRow.tvalue.toFixed(2);
          setTableData([...formattedData, totalRow]);

          setPieChartData(
            res.map((item) => ({
              name: item.block_name,
              y: item.total,
            }))
          );

          setBarGraphData(
            res.map((item) => ({
              category: item.block_name,
              previous: Number(item.arrears) || 0,
              current: Number(item.current) || 0,
              total: Number(item.total) || 0,
            }))
          );

          tableRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }
      } catch (error) {
        console.error("Error fetching MIS data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userid, wardId, zoneId]);

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      <PageHeader
        title="Wardwise Tax Collection"
        subtitle="Water Tax"
        onBack={handleGoBack}
      />

      <SubHeaderCard
        subtitle="Ward / Zone"
        title={`${wardName || ""}${zoneName ? ` / ${zoneName}` : ""}`}
        infoText="Yearly Collection (All amounts shown are in lakhs)"
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
            headers={headers}
            data={tableData}
            keyMapping={{
              Block: "block",
              Arrears: "mvalue",
              Current: "cvalue",
              Total: "tvalue",
            }}
          />
          {/* )} */}
        </div>
      </section>
      <section className="container mx-auto mt-4 mb-5 px-4" ref={pieRef}>
        <div className="rounded-[24px] bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
          {/* {activeView === "pie" && ( */}
          <PieChartComponent
            data={pieChartData}
          />
          {/* )} */}
        </div>
      </section>
      <section className="container mx-auto mt-4 mb-5 px-4" ref={barRef}>
        <div className="rounded-[24px] bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
          {/* {activeView === "bar" && ( */}
          <StackedBarGraph
            data={barGraphData}
            yAxisTitle="Amount"
            seriesConfig={[
              { name: "Arrears", key: "previous", color: "#3b82f6" },
              { name: "Current", key: "current", color: "#10b981" },
            ]}
          />
          {/* )} */}
        </div>
      </section>
    </div>
  );
};

export default WardWiseTaxbyzoneid;