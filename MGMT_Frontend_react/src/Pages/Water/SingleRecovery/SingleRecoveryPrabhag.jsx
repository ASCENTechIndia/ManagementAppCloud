import React, { useState, useEffect, useRef } from "react";
import Table from "../../../Components/Table/Table";
import { useAuth } from "../../../Context/AuthContext";
import { Table as TableIcon, PieChart, BarChart3 } from "lucide-react";
import PieChartComponent from "../../../Pages/Property/Tax/PieChartComponent";
import apiService from "../../../../apiService";
import { useLocation, useNavigate } from "react-router-dom";
import StackedBarGraph from "../../../Components/StackedBarGraph";
import { useLoader } from "../../../Context/LoaderContext";
import {
  PageHeader,
  SubHeaderCard,
  CustomButton,
} from "../../../Components/NewLayout";

const SingleRecoveryPrabhag = () => {
  const [activeView, setActiveView] = useState("table");
  const tableRef = useRef(null);
  const pieRef = useRef(null);
  const barRef = useRef(null);
  const [tableData, setTableData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [barGraphData, setBarGraphData] = useState([]);
  const { setLoading } = useLoader();

  const { user } = useAuth();
  const orgId = user?.data?.OrgId;

  const location = useLocation();
  const navigate = useNavigate();
  const { wardId, wardName } = location.state || {};

  const handleGoBack = () => {
    navigate("/waterdashboard");
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !wardId) return;

      try {
        setLoading(true);
        const payload = {
          Request1: `CollectionCenter$prabhag_demcollper$${user.userId}$${orgId}~${wardId}~`,
          Request2: "a",
          Request3: "a",
          Request4: "a",
          Request5: "a",
          Request6: "a",
          Request7: "a",
        };

        const response = await apiService.post("WTgeneric-call", payload);
        const jsonData = response.data?.data?.jsondata || [];

        const numericData = jsonData.map((item) => ({
          ...item,
          demand: parseFloat(item.demand) || 0,
          totcol: parseFloat(item.totcol) || 0,
          outstd: parseFloat(item.outstd) || 0,
          colper: parseFloat(item.colper) || 0,
        }));

        const totalRow = numericData.reduce(
          (acc, cur) => {
            acc.demand += cur.demand;
            acc.totcol += cur.totcol;
            acc.outstd += cur.outstd;
            return acc;
          },
          { zone_name: "एकूण", demand: 0, totcol: 0, outstd: 0, colper: 0 }
        );

        totalRow.colper = totalRow.demand
          ? Number(((totalRow.totcol / totalRow.demand) * 100).toFixed(2))
          : 0;

        totalRow.demand = Number(totalRow.demand.toFixed(2));
        totalRow.totcol = Number(totalRow.totcol.toFixed(2));
        totalRow.outstd = Number(totalRow.outstd.toFixed(2));

        setTableData([...numericData, totalRow]);

        setPieChartData(
          numericData.map((item) => ({
            name: item.zone_name,
            y: item.colper,
          }))
        );

        setBarGraphData(
          numericData.map((item) => ({
            category: item.zone_name,
            percentage: Number(item.colper) || 0,
          }))
        );

        tableRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, wardId]);

  const headers = ["Zone", "Demand", "Collection", "Arrears", "Percentage"];

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      <PageHeader
        title="Percentage Report"
        subtitle="Water Tax"
        onBack={handleGoBack}
      />

      <SubHeaderCard
        subtitle="Ward"
        title={
          <>
            <span
              className="cursor-pointer hover:underline"
              onClick={() => navigate("/SingleRecovery")}
            >{`All Wards`}</span> {`${wardName ? `/ ${wardName}` : ""}`}
          </>
        }
        infoText="Comparative Information (All amounts shown are in lakhs)"
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
              Zone: "zone_name",
              Demand: "demand",
              Collection: "totcol",
              Arrears: "outstd",
              Percentage: "colper",
            }}
            customCellRenderer={{
              zone_name: (value, row) => (
                <span
                  style={{
                    color: row.zone_name !== "एकूण" ? "#007bff" : "black",
                    cursor: row.zone_name !== "एकूण" ? "pointer" : "default",
                    textDecoration:
                      row.zone_name !== "एकूण" ? "underline" : "none",
                  }}
                  onClick={() =>
                    navigate("/SingleRecoveryBlock", { state: { wardId: wardId, wardName: wardName, zoneId: row.zone_id, zoneName: row.zone_name } })
                  }
                >
                  {value}
                </span>
              ),
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
            yAxisTitle="Percentage (%)"
            seriesConfig={[
              { name: "Percentage", key: "percentage", color: "#3b82f6" },
            ]}
          />
          {/* )} */}
        </div>
      </section>
    </div>
  );
};

export default SingleRecoveryPrabhag;
