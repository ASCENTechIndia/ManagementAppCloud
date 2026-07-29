import React, { useEffect, useRef, useState } from "react";
import Table from "../../../Components/Table/Table";
import { useNavigate, useLocation } from "react-router-dom";
import { Table as TableIcon, PieChart, BarChart3 } from "lucide-react";
import PieChartComponent from "../Tax/PieChartComponent";
import StackedBarGraph from "../../../Components/StackedBarGraph";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";
import {
  PageHeader,
  SubHeaderCard,
  CustomButton,
} from "../../../Components/NewLayout";

const TCDPrabhag = () => {
  const { setLoading } = useLoader();
  const { user } = useAuth();
  const userid = user?.userId || "";
  const orgId = user?.data?.OrgId;
  const navigate = useNavigate();
  const location = useLocation();
  const { ward_id, wardName } = location.state || {};

  const [activeView, setActiveView] = useState("table");
  const [tableHeader, setTableHeader] = useState(["झोन", "मागील", "चालू", "एकूण"]);
  const [tableData, setTableData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const tableRef = useRef(null);
  const pieRef = useRef(null);
  const barRef = useRef(null);

  const handleGoBack = () => navigate("/propertydashboard");

  const fetchWards = async () => {
    setLoading(true);
    try {
      const payload = {
        Request1: `MobApp$PrabhagZonewise_Demand$${userid}$${orgId}~${ward_id}`,
        Request2: "",
        Request3: "",
        Request4: "",
        Request5: "",
        Request6: "",
        Request7: "",
      };

      const response = await apiService.post("generic-call", payload);
      const jsonData = response?.data?.data?.jsondata || [];

      const result = jsonData.map((item) => ({
        zone_name: item.zone_name?.trim() || "-",
        zone_id: item.zone_id,
        ward_id: ward_id,
        arrears: parseFloat(item.arrears) || 0,
        current: parseFloat(item.current) || 0,
        total: parseFloat(item.total) || 0,
      }));

      const totalRow = result.reduce(
        (acc, cur) => {
          acc.arrears += cur.arrears;
          acc.current += cur.current;
          acc.total += cur.total;
          return acc;
        },
        { zone_name: "एकूण", arrears: 0, current: 0, total: 0 }
      );

      totalRow.arrears = parseFloat(totalRow.arrears.toFixed(2));
      totalRow.current = parseFloat(totalRow.current.toFixed(2));
      totalRow.total = parseFloat(totalRow.total.toFixed(2));

      setTableData([...result, totalRow]);

      setPieData(
        result.map((item) => ({
          name: item.zone_name,
          y: Number(item.total),
        }))
      );

      setBarData(
        result.map((item) => ({
          category: item.zone_name,
          previous: Number(item.arrears),
          current: Number(item.current),
        }))
      );

      tableRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center"
      })
    } catch (error) {
      console.error("Error fetching zone-wise demand:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!ward_id || !userid) return;
    fetchWards();
  }, [ward_id, userid]);

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      <PageHeader
        title="Wardwise Tax Demand"
        subtitle="Property Tax"
        onBack={handleGoBack}
      />

      <SubHeaderCard
        subtitle="Zone"
        title={
          <span>
            <span
              className="text-white/80 cursor-pointer hover:underline"
              onClick={() => navigate("/TaxCollectionDemand")}
            >
              All Wards
            </span>{" "}
            {wardName ? `/ ${wardName}` : ""}
          </span>
        }
        infoText="Yearly Demand (All amounts shown are in lakhs)"
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
              झोन: "zone_name",
              मागील: "arrears",
              चालू: "current",
              एकूण: "total",
            }}
            pagination={true}
            rowsPerPage={10}
            customCellRenderer={{
              zone_name: (value, row) => {
                if (value === "एकूण") {
                  return <span style={{ fontWeight: "bold" }}>{value}</span>;
                }
                return (
                  <span
                    style={{
                      color: "#007bff",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={() =>
                      navigate("/TCDWard", {
                        state: {
                          ward_id: row.ward_id,
                          wardName: wardName,
                          zone_id: row.zone_id,
                          zoneName: row.zone_name,
                        },
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
          {/* {activeView === "pie" &&  */}
          <PieChartComponent data={pieData} />
          {/* // } */}
        </div>
      </section>

      <section className="container mx-auto mt-4 mb-5 px-4" ref={barRef}>
        <div className="rounded-[24px] bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
          {/* {activeView === "bar" && ( */}
          <StackedBarGraph
            data={barData}
            yAxisTitle="Amount (lakhs)"
            seriesConfig={[
              { name: "मागील", key: "previous", color: "#3b82f6" },
              { name: "चालू", key: "current", color: "#10b981" },
            ]}
          />
        </div>
      </section>
      {/* )} */}

    </div>
  );
};

export default TCDPrabhag;

