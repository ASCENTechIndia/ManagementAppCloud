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
import useAlert from "../../../Components/CustomAlert/useAlert";

const TotalCollPercent = () => {
  const flag = import.meta.env.VITE_FLAG;
  const { setLoading } = useLoader();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showAlert, Alert } = useAlert();
  const userid = user?.userId || "";
  const orgId = user?.data?.OrgId;
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

  const headers = selectedZone === null
    ? ["Zone", "Demand", "Collection", "Arrears", "Percentage"]
    : ["Ward", "Demand", "Collection", "Arrears", "Percentage"];

  const keyMapping = selectedZone === null
    ? {
      Zone: "zone",
      Demand: "demand",
      Collection: "collection",
      Arrears: "arrears",
      Percentage: "percentage",
    }
    : {
      Ward: "wardName",
      Demand: "demand",
      Collection: "collection",
      Arrears: "arrears",
      Percentage: "percentage",
    };

  useEffect(() => {
    if (!userid) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const payload = {
          Request1: selectedZone === null
            ? `${flag}$cfcprabhag_demcollper$${userid}$${orgId}~`
            : `${flag}$cfcPrabhagZoneWise_DemCollPerc$${userid}$${orgId}~${selectedZone.id}~`,
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
            for (let i = 2; i < parts.length; i += 5) {
              if (parts[i]) {
                data.push({
                  zone: parts[i],
                  demand: parts[i + 1] || "0",
                  collection: parts[i + 2] || "0",
                  arrears: parts[i + 3] || "0",
                  percentage: parts[i + 4] || "0",
                });
              }
            }
          } else {
            for (let i = 2; i < parts.length; i += 7) {
              if (parts[i]) {
                data.push({
                  zoneId: parts[i],
                  wardId: parts[i + 1],
                  wardName: parts[i + 2],
                  demand: parts[i + 3] || "0",
                  collection: parts[i + 4] || "0",
                  arrears: parts[i + 5] || "0",
                  percentage: parts[i + 6] || "0",
                });
              }
            }
          }

          if (data.length > 0) {
            const hasTotalRow = data.some(
              (item) => item.zone === "Total" || item.wardName === "Total"
            );

            let displayData = [...data];

            if (!hasTotalRow) {
              const totalDemand = data.reduce((acc, item) => acc + Number(item.demand || 0), 0);
              const totalCollection = data.reduce((acc, item) => acc + Number(item.collection || 0), 0);
              const totalArrears = data.reduce((acc, item) => acc + Number(item.arrears || 0), 0);
              const totalPercentage = totalDemand > 0 ? (totalCollection / totalDemand) * 100 : 0;

              const totalRow = selectedZone === null
                ? {
                  zone: "Total",
                  demand: totalDemand.toFixed(2),
                  collection: totalCollection.toFixed(2),
                  arrears: totalArrears.toFixed(2),
                  percentage: totalPercentage.toFixed(2),
                }
                : {
                  wardName: "Total",
                  demand: totalDemand.toFixed(2),
                  collection: totalCollection.toFixed(2),
                  arrears: totalArrears.toFixed(2),
                  percentage: totalPercentage.toFixed(2),
                };
              displayData.push(totalRow);
            }

            setTableData(displayData);

            const chartDataItems = data.filter(
              (item) => item.zone !== "Total" && item.wardName !== "Total"
            );

            setPieChartData(
              chartDataItems.map((item) => ({
                name: selectedZone === null ? item.zone : item.wardName,
                y: Number(item.collection) || 0,
              }))
            );

            setBarGraphData(
              chartDataItems.map((item) => ({
                category: selectedZone === null ? item.zone : item.wardName,
                demand: Number(item.demand) || 0,
                collection: Number(item.collection) || 0,
                arrears: Number(item.arrears) || 0,
              }))
            );

          } else {
            setTableData([]);
            setPieChartData([]);
            setBarGraphData([]);
            showAlert("No Data Found", "error");
          }
        } else if (Array.isArray(resData.jsondata) && resData.jsondata.length > 0) {
          const data = selectedZone === null ? resData.jsondata.map((data) => ({
            id: data.prabhagid,
            zone: data.prabhag,
            demand: data.demandtot,
            collection: data.collectiontot,
            arrears: data.pendingtot,
            percentage: data.percenttot || "-",
          })) : resData.jsondata.map((data) => ({
            id: data.collcnid,
            wardName: data.zone,
            demand: data.demand,
            collection: data.collect,
            arrears: data.outstnd,
            percentage: data.perc
          }))
          // console.log(data);
          // const totalSum = data.reduce((acc, item) => acc + Number(item.total || 0), 0);
          // const tableDataWithTotal = selectedZone === null ? [
          //   ...data,
          //   {
          //     zone: "Total",
          //     total: totalSum.toFixed(2),
          //   }
          // ] : [
          //   ...data,
          //   {
          //     wardName: "Total",
          //     total: totalSum.toFixed(2),
          //   }
          // ];
          const hasTotalRow = data.some(
            (item) => item.zone === "Total" || item.wardName === "Total"
          );

          if (!hasTotalRow) {
              const totalDemand = data.reduce((acc, item) => acc + Number(item.demand || 0), 0);
              const totalCollection = data.reduce((acc, item) => acc + Number(item.collection || 0), 0);
              const totalArrears = data.reduce((acc, item) => acc + Number(item.arrears || 0), 0);
              const totalPercentage = totalDemand > 0 ? (totalCollection / totalDemand) * 100 : 0;

              const totalRow = selectedZone === null
                ? {
                  zone: "Total",
                  demand: totalDemand.toFixed(2),
                  collection: totalCollection.toFixed(2),
                  arrears: totalArrears.toFixed(2),
                  percentage: totalPercentage.toFixed(2),
                }
                : {
                  wardName: "Total",
                  demand: totalDemand,
                  collection: totalCollection,
                  arrears: totalArrears,
                  percentage: totalPercentage.toFixed(2),
                };
              data.push(totalRow);
            }


          const chartDataItems = data.filter(
            (item) => item.zone !== "Total" && item.wardName !== "Total"
          );
          // console.log(chartDataItems);
          setTableData(data);

          // const bothChartData = data.map((data) => ({
          //   value: Number(data.percentage),
          //   label: data.zone,
          // }));

          const pieData = chartDataItems.map(data => ({
            name: selectedZone === null ? data.zone : data.wardName,
            y: Number(data.collection) || 0,
          }))

          const stackedBarData = chartDataItems.map((item) => ({
            category: selectedZone === null ? item.zone : item.wardName,
            demand: Number(item.demand) || 0,
            collection: Number(item.collection) || 0,
            arrears: Number(item.arrears) || 0,
          }))
          setBarGraphData(stackedBarData);
          setPieChartData(pieData);
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
          showAlert("No Data Found", "error");
        }
      } catch (error) {
        console.error("Error fetching collection percentage data:", error);
        showAlert("Error fetching data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userid, selectedZone]);

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      <PageHeader
        title={"Total Collection %"}
        subtitle="CFC Tax"
        onBack={handleGoBack}
      />
      <Alert />
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
        infoText="Yearly Collection & Demand (All amounts shown are in lakhs.)"
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
            customCellRenderer={
              selectedZone === null
                ? {
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
                  },
                }
                : {
                  wardName: (value) => {
                    if (value === "Total") {
                      return <span style={{ fontWeight: "bold" }}>{value}</span>;
                    }
                    return <span>{value}</span>;
                  },
                }
            }
          />
          {/* )} */}
        </div>
      </section>
      <section className="container mx-auto mt-4 mb-5 px-4" ref={pieRef}>
        <div className="rounded-[24px] bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
          {/* {activeView === "pie" && ( */}
          <PieChartComponent data={pieChartData} />
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
              { name: "Demand", key: "demand", color: "#3b82f6" },
              { name: "Collection", key: "collection", color: "#10b981" },
              { name: "Arrears", key: "arrears", color: "#f59e0b" },
            ]}
          />
          {/* )} */}
        </div>
      </section>
    </div>
  );
};

export default TotalCollPercent;
