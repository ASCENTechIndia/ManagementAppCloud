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

const WardWiseTaxbywardid = () => {
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

  const handleGoBack = () => {
    navigate("/waterdashboard");
  };

  const headers = ["Zone", "Arrears", "Current", "Total"];

  useEffect(() => {
    if (!userid || !wardId) return;
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await apiService.post("WTgeneric-call", {
          Request1: `MobApp$PrabhagWise_Collection$${userid}$${orgId}~${wardId}`,
          Request2: "",
          Request3: "",
          Request4: "",
          Request5: "",
          Request6: "",
          Request7: "",
        });

        let res = [];
        const rawData = response.data?.data;

        if (typeof rawData === "string") {
          try {
            const parsed = JSON.parse(rawData);
            res = parsed?.jsondata || [];
          } catch (err) {
            console.error("Failed to parse string response:", err);
          }
        } else {
          res = rawData?.jsondata || [];
        }

        if (res.length > 0) {
          const formattedData = res.map((item) => ({
            zone: item.zone_name,
            mvalue: item.arrears,
            cvalue: item.current,
            tvalue: item.total,
            zoneId: item.zone_id,
          }));

          const totalRow = formattedData.reduce(
            (acc, cur) => {
              acc.mvalue += Number(cur.mvalue) || 0;
              acc.cvalue += Number(cur.cvalue) || 0;
              acc.tvalue += Number(cur.tvalue) || 0;
              return acc;
            },
            { zone: "Total", mvalue: 0, cvalue: 0, tvalue: 0 }
          );

          totalRow.mvalue = totalRow.mvalue.toFixed(2);
          totalRow.cvalue = totalRow.cvalue.toFixed(2);
          totalRow.tvalue = totalRow.tvalue.toFixed(2);

          setTableData([...formattedData, totalRow]);

          const pieData = res.map((item) => ({
            name: item.zone_name,
            y: Number(item.total) || 0,
          }));
          setPieChartData(pieData);

          const barData = res.map((item) => ({
            category: item.zone_name,
            previous: Number(item.arrears) || 0,
            current: Number(item.current) || 0,
            total: Number(item.total) || 0,
          }));
          setBarGraphData(barData);

          tableRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        } else {
          console.warn("No jsondata found in response.");
        }
      } catch (error) {
        console.error("Error fetching MIS data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userid, wardId]);

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      <PageHeader
        title="Wardwise Tax Collection"
        subtitle="Water Tax"
        onBack={handleGoBack}
      />

      <SubHeaderCard
        subtitle="Ward"
        title={`All Wards ${wardName ? `/ ${wardName}` : ""}`}
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
              Zone: "zone",
              Arrears: "mvalue",
              Current: "cvalue",
              Total: "tvalue",
            }}
            customCellRenderer={{
              zone: (value, row) => {
                if (value === "Total") {
                  return (
                    <span style={{ fontWeight: "bold" }}>
                      {value}
                    </span>
                  );
                }

                return (
                  <span
                    style={{
                      color: "#007bff",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={() =>
                      navigate("/WardWiseTaxbyzoneid", {
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

export default WardWiseTaxbywardid;