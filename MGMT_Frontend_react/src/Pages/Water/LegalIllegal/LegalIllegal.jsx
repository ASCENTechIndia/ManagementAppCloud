import React, { useState, useEffect, useRef } from "react";
import TableComponent from "../../../Components/TableComponent";
import Table from "../../../Components/Table/Table";
import { useAuth } from "../../../Context/AuthContext";
import { Table as TableIcon, PieChart, BarChart3 } from "lucide-react";
import PieChartComponent from "../../../Components/PieChart";
import apiService from "../../../../apiService";
import { useNavigate } from "react-router-dom";
import StackedBarGraph from "../../../Components/StackedBarGraph";
import { useLoader } from "../../../Context/LoaderContext";
import {
  PageHeader,
  SubHeaderCard,
  CustomButton,
} from "../../../Components/NewLayout";

const LegalIllegal = () => {
  const { setLoading } = useLoader();
  const [activeView, setActiveView] = useState("table");
  const [tableData, setTableData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [barGraphData, setBarGraphData] = useState([]);
  const tableRef = useRef(null);
  const pieRef = useRef(null);
  const barRef = useRef(null);
  const { user } = useAuth();
  const orgId = user?.data?.OrgId;

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/waterdashboard");
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const payload = {
          Request1: `MobApp$MIS_legalillgal$${user.userId}$${orgId}~~`,
          Request2: "",
          Request3: "",
          Request4: "",
          Request5: "",
          Request6: "",
          Request7: "",
        };

        const response = await apiService.post("WTgeneric-call", payload);

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
              ward_name: "एकूण",
              legal_propcount: 0,
              illlegal_propcount: 0,
              total_propcount: 0,
            }
          );

          setTableData([...jsonData, totalRow]);
          setPieChartData(
            jsonData.map((item) => ({
              label: item.ward_name,
              value: Number(item.total_propcount),
            }))
          );
          setBarGraphData(
            jsonData.map((item) => ({
              category: item.ward_name,
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
        console.error("Error fetching Legal/Illegal data:", error);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const headers = ["Ward", "Active", "Inactive", "Total"];

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      <PageHeader
        title="Active & Inactive"
        subtitle="Water Tax"
        onBack={handleGoBack}
      />

      <SubHeaderCard
        subtitle="Ward"
        title="All Wards"
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
          <Table
            headers={headers}
            data={tableData}
            keyMapping={{
              Ward: "ward_name",
              Active: "legal_propcount",
              Inactive: "illlegal_propcount",
              Total: "total_propcount",
            }}
            customCellRenderer={{
              ward_name: (value, row) => (
                <span
                  style={{
                    color: row.ward_name !== "एकूण" ? "#007bff" : "black",
                    cursor: row.ward_name !== "एकूण" ? "pointer" : "default",
                    textDecoration:
                      row.ward_name !== "एकूण" ? "underline" : "none",
                  }}
                  onClick={() =>
                    row.ward_name !== "एकूण" &&
                    navigate("/WaterActivePrabhag", {
                      state: { wardId: row.ward_id, wardName: row.ward_name },
                    })
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
            title="Water Active"
            description=""
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

export default LegalIllegal;
