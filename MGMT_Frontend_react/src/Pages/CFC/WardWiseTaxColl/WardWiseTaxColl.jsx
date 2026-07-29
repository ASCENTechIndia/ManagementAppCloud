import React, { useState, useEffect, useRef } from "react";
import { Table as TableIcon, PieChart, BarChart3 } from "lucide-react";
import PieChartComponent from "../../Property/Tax/PieChartComponent";
import StackedBarGraph from "../../../Components/StackedBarGraph";
import { useLoader } from "../../../Context/LoaderContext";
import { useAuth } from "../../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import Table from "../../../Components/Table/Table";
import apiService from "../../../../apiService";
import {
  PageHeader,
  SubHeaderCard,
  CustomButton,
} from "../../../Components/NewLayout";

const WardWiseTaxColl = () => {
  const { setLoading } = useLoader();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userid = user?.userId || "";
  const orgId = user?.data?.OrgId;
  const flag = import.meta.env.VITE_FLAG;
  const tableRef = useRef(null);
  const pieRef = useRef(null);
  const barRef = useRef(null);
  const [tableData, setTableData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [barGraphData, setBarGraphData] = useState([]);
  const [activeView, setActiveView] = useState("table");
  const [selectedZone, setSelectedZone] = useState(null);

  const handleGoBack = () => {
    if (selectedZone !== null) {
      setSelectedZone(null);
    } else {
      navigate("/CfcDashBoard");
    }
  };

  const headers = selectedZone === null ? ["Zone", "Total"] : ["Ward", "Total"];
  const keyMapping = selectedZone === null
    ? { Zone: "zone", Total: "total" }
    : { Ward: "wardName", Total: "total" };

  useEffect(() => {
    if (!userid) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const payload = {
          Request1: selectedZone === null
            ? `${flag}$cfcPrabhagWise_Collection$${userid}$${orgId}`
            : `${flag}$cfcPrabhagWise_TotalCollection$${userid}$${orgId}~${selectedZone.id}~`,
          Request2: "",
          Request3: "",
          Request4: "",
          Request5: "",
          Request6: "",
          Request7: "",
        };

        const response = await apiService.post("WTgeneric-call", payload);
        const resData = response.data?.data;

        if (typeof resData === "string" && resData.includes("SUCCESS")) {
          const responseStr = resData.replace(/^respon:/, "");
          const parts = responseStr.split("$");

          let data = [];
          if (selectedZone === null) {
            for (let i = 2; i < parts.length; i += 2) {
              if (parts[i]) {
                data.push({
                  zone: parts[i],
                  total: parts[i + 1] || "0",
                });
              }
            }
          } else {
            for (let i = 2; i < parts.length; i += 4) {
              if (parts[i]) {
                data.push({
                  zoneId: parts[i],
                  wardId: parts[i + 1],
                  wardName: parts[i + 2],
                  total: parts[i + 3] || "0",
                });
              }
            }
          }

          if (data.length > 0) {
            const totalSum = data.reduce((acc, item) => acc + Number(item.total || 0), 0);

            const totalRow = selectedZone === null
              ? { zone: "Total", total: totalSum.toFixed(2) }
              : { wardName: "Total", total: totalSum.toFixed(2) };

            setTableData([...data, totalRow]);

            setPieChartData(
              data.map((item) => ({
                name: selectedZone === null ? item.zone : item.wardName,
                y: Number(item.total) || 0,
              }))
            );

            setBarGraphData(
              data.map((item) => ({
                category: selectedZone === null ? item.zone : item.wardName,
                total: Number(item.total) || 0,
              }))
            );
          } else {
            setTableData([]);
            setPieChartData([]);
            setBarGraphData([]);
          }
        } else if (Array.isArray(resData.jsondata) && resData.jsondata.length > 0) {
          const data = selectedZone === null ? resData.jsondata.map((data) => ({
            id: data.prabhag,
            zone: data.prabhagname || data.zone || "",
            total: data.rec_amount || data.collec,
          })) : resData.jsondata.map((data) => ({
            id: data.zoneid,
            wardName: data.zone,
            total: data.collec
          }))
          const totalSum = data.reduce((acc, item) => acc + Number(item.total || 0), 0);
          const tableDataWithTotal = selectedZone === null ? [
            ...data,
            {
              zone: "Total",
              total: totalSum.toFixed(2),
            }
          ] : [
            ...data,
            {
              wardName: "Total",
              total: totalSum.toFixed(2),
            }
          ];
          setTableData(tableDataWithTotal);

          const bothChartData = data.map((data) => ({
            value: Number(data.total),
            label: data.zone,
          }));

          setBarGraphData(bothChartData);
          setPieChartData(bothChartData);
          setTimeout(() => {
            tableRef.current.scrollIntoView({
              behavior: "smooth",
              block: "center"
            });
          }, 100);
        } else {
          setTableData([]);
          setPieChartData([]);
          setBarGraphData([]);
        }
      } catch (error) {
        console.error("Error fetching collection data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userid, selectedZone]);

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      <PageHeader
        title={"Wardwise Tax Collection"}
        subtitle="CFC Tax"
        onBack={handleGoBack}
      />

      <SubHeaderCard
        subtitle="Zone"
        title={
          selectedZone === null ? (
            "All Zones"
          ) : (
            <>
              <span
                className="cursor-pointer hover:underline"
                onClick={() => setSelectedZone(null)}
              >
                All Zones
              </span> / {selectedZone.name}
            </>
          )
        }
        infoText="Yearly Collection (All amounts shown are in lakhs.)"
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
            keyMapping={keyMapping}
            pagination={true}
            rowsPerPage={10}
            customCellRenderer={selectedZone === null ? {
              zone: (value, row) => {
                if (value === "Total") {
                  return <span style={{ fontWeight: "bold" }}>{value}</span>;
                }
                return (
                  <span
                    style={{
                      color: "#007bff",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={() => {
                      setSelectedZone({ id: row.id, name: value });
                    }}
                  >
                    {value}
                  </span>
                );
              }
            } : {
              wardName: (value) => {
                if (value === "Total") {
                  return <span style={{ fontWeight: "bold" }}>{value}</span>;
                }
                return <span>{value}</span>;
              }
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
              { name: "Total", key: "total", color: "#3b82f6" }
            ]}
          />
          {/* )} */}
        </div>
      </section>
    </div>
  );
};

export default WardWiseTaxColl;
