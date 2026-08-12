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

const ZoneWiseTaxColl = () => {
  const { setLoading } = useLoader();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showAlert, hideAlert, Alert } = useAlert();
  const userid = user?.userId || "";
  const orgId = user?.data?.OrgId;
  const flag = import.meta.env.VITE_FLAG;
  const [tableData, setTableData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [barGraphData, setBarGraphData] = useState([]);
  const [activeView, setActiveView] = useState("table");
  const tableRef = useRef(null);
  const pieRef = useRef(null);
  const barRef = useRef(null);
  const handleGoBack = () => {
    navigate("/CfcDashBoard");
  };

  const headers = ["Zone", "Total"];
  const keyMapping = {
    Zone: "zone",
    Total: "total",
  };

  useEffect(() => {
    if (!userid) return;
    const fetchData = async () => {
      hideAlert();
      try {
        setLoading(true);
        const payload = {
          Request1: `${flag}$daily_cfccollection$${userid}$${orgId}~ ~`,
          Request2: "",
          Request3: "",
          Request4: "",
          Request5: "",
          Request6: "",
          Request7: "",
        };

        const response = await apiService.post("WTgeneric-call", payload);
        // console.log(response);
        // return;
        const resData = response.data?.data;

        if (typeof resData === "string" && resData.includes("SUCCESS")) {
          const responseStr = resData.replace(/^respon:/, "");
          const parts = responseStr.split("SUCCESS$");

          if (parts.length > 1) {
            const dataPart = parts[1];
            const items = dataPart.split("@");
            const data = [];

            for (let item of items) {
              if (item) {
                const itemParts = item.split("$");
                if (itemParts.length >= 3) {
                  data.push({
                    zone: itemParts[0],
                    zoneId: itemParts[1],
                    total: itemParts[2] || "0",
                  });
                }
              }
            }

            if (data.length > 0) {
              hideAlert();
              const totalSum = data.reduce((acc, item) => acc + Number(item.total || 0), 0);

              const totalRow = {
                zone: "Total",
                total: totalSum.toFixed(2),
              };

              setTableData([...data, totalRow]);

              setPieChartData(
                data.map((item) => ({
                  name: item.zone,
                  y: Number(item.total) || 0,
                }))
              );

              setBarGraphData(
                data.map((item) => ({
                  category: item.zone,
                  total: Number(item.total) || 0,
                }))
              );
            } else {
              setTableData([]);
              setPieChartData([]);
              setBarGraphData([]);
              showAlert("No Data Found", "error");
            }
          } else {
            setTableData([]);
            setPieChartData([]);
            setBarGraphData([]);
            showAlert("No Data Found", "error");
          }
        } else if (Array.isArray(resData.jsondata) && resData.jsondata.length > 0) {
          hideAlert();
          const data = resData.jsondata.map((data) => ({
            id: data.prabhag,
            zone: data.prabhagname || data.prabhag_name,
            total: data.coll
          }))

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
          setTableData(data);

          // const bothChartData = data.map((data) => ({
          //   value: Number(data.percentage),
          //   label: data.zone,
          // }));

          const pieData = data.map(data => ({
            name: data.zone,
            y: Number(data.total) || 0,
          }))

          const stackedBarData = data.map((item) => ({
            category: item.zone,
            total: Number(item.total)
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
        console.error("Error fetching daily collection data:", error);
        showAlert("Error fetching data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userid, orgId]);

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      <PageHeader
        title="Zonewise Tax Collection"
        subtitle="CFC Tax"
        onBack={handleGoBack}
      />
      <Alert />
      <SubHeaderCard
        subtitle="Zone"
        title="All Zones"
        infoText="Daily Collection (All amounts shown are in lakhs)"
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
            customCellRenderer={{
              zone: (value) => {
                if (value === "Total") {
                  return <span style={{ fontWeight: "bold" }}>{value}</span>;
                }
                return <span>{value}</span>;
              },
            }}
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
              { name: "Total", key: "total", color: "#3b82f6" },
            ]}
          />
          {/* )} */}
        </div>
      </section>
    </div>
  );
};

export default ZoneWiseTaxColl;
