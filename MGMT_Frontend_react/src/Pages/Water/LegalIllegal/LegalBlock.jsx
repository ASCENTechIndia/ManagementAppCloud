import React, { useState, useEffect, useRef } from "react";
import TableComponent from "../../../Components/TableComponent";
import { useAuth } from "../../../Context/AuthContext";
import { Table as TableIcon, PieChart, BarChart3 } from "lucide-react";
import PieChartComponent from "../../../Components/PieChart";
import BarGraphComponent from "../../../Components/Charts/BarChart/BarChart";
import apiService from "../../../../apiService";
import { useLocation, useNavigate } from "react-router-dom";
import StackedBarGraph from "../../../Components/StackedBarGraph";
import { useLoader } from "../../../Context/LoaderContext";
import {
  PageHeader,
  SubHeaderCard,
  CustomButton,
} from "../../../Components/NewLayout";

const LegalBlock = () => {
  const [activeView, setActiveView] = useState("table");
  const [tableData, setTableData] = useState([]);
  const { setLoading } = useLoader();
  const { user } = useAuth();
  const tableRef = useRef(null);
  const pieRef = useRef(null);
  const barRef = useRef(null);
  const userId = user?.userId;
  const orgId = user?.data?.OrgId;
  const [pieChartData, setPieChartData] = useState([]);
  const [barGraphData, setBarGraphData] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const { wardId, wardName, zoneId, zoneName } = location.state || {};

  const handleGoBack = () => {
    navigate("/waterdashboard");
  };

  useEffect(() => {
    const fetchData = async () => {
      // if (!userId || !wardId || !zoneId) {
      //   alert("UserId or wardId or zoneId is not set");
      //   return;
      // }

      try {
        setLoading(true);
        const payload = {
          Request1: `MobApp$MIS_legalillgal$${userId}$${orgId}~${wardId}~${zoneId}`,
          Request2: "",
          Request3: "",
          Request4: "",
          Request5: "",
          Request6: "",
          Request7: "",
        };

        const response = await apiService.post("WTgeneric-call", payload);
        console.log("block reponse:", response);
        if (
          Array.isArray(response.data?.data?.jsondata) &&
          response.data?.data?.jsondata?.length > 0
        ) {
          const jsonData = response.data?.data?.jsondata || [];

          const totalRow = jsonData.reduce(
            (acc, cur) => {
              acc.legal_propcount += Number(cur.legal_propcount);
              acc.illlegal_propcount += Number(cur.illlegal_propcount);
              acc.total_propcount += Number(cur.total_propcount);
              return acc;
            },
            {
              block_name: "एकूण",
              legal_propcount: 0,
              illlegal_propcount: 0,
              total_propcount: 0,
            }
          );

          setTableData([...jsonData, totalRow]);

          setPieChartData(
            jsonData.map((item) => ({
              label: item.block_name,
              value: Number(item.total_propcount),
            }))
          );

          setBarGraphData(
            jsonData.map((item) => ({
              category: item.block_name,
              previous: Number(item.legal_propcount) || 0,
              current: Number(item.illlegal_propcount) || 0,
              total: Number(item.total_propcount) || 0,
            }))
          );

          setTimeout(() => {
            tableRef.current.scrollIntoView({
              behavior: "smooth",
              block: "center"
            });
          }, 100);
        } else {
          alert("No record found");
        }
      } catch (error) {
        console.error("Error fetching Legal/Illegal Block data:", error);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId && wardId && zoneId) fetchData();
  }, [userId, wardId, zoneId]);

  const headers = ["Block", "Active", "Inactive", "Total"];

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      <PageHeader
        title="Active & Inactive"
        subtitle="Water Tax"
        onBack={handleGoBack}
      />

      <SubHeaderCard
        subtitle="Ward / Zone"
        title={
          <>
          <span
            className="cursor-pointer hover:underline"
            onClick={() => navigate("/WaterActivePrabhag", {
              state: {
                wardId,
                wardName
              }
            })}
          >
           {`${wardName || ""}`}
          </span>
          {`${zoneName ? ` / ${zoneName}` : ""}`}
          </>
        }
        infoText="All properties"
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
          <TableComponent
            headers={headers}
            data={tableData}
            keyMapping={{
              Block: "block_name",
              Active: "legal_propcount",
              Inactive: "illlegal_propcount",
              Total: "total_propcount",
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
            label="Water"
            description={""}
          />
          {/* )} */}
        </div>
        /</section>
      <section className="container mx-auto mt-4 mb-5 px-4" ref={barRef}>
        <div className="rounded-[24px] bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
          {/* {activeView === "bar" && ( */}
          <StackedBarGraph
            data={barGraphData}
            yAxisTitle="Amount"
            seriesConfig={[
              { name: "Legal", key: "previous", color: "#3b82f6" },
              { name: "Illegal", key: "current", color: "#f59e0b" },
            ]}
          />
          {/* )} */}
        </div>
      </section>
    </div>
  );
};

export default LegalBlock;
