import React, { useState, useEffect, useRef } from "react";
import Table from "../../../Components/Table/Table";
import { useAuth } from "../../../Context/AuthContext";
import { Table as TableIcon, PieChart, BarChart3 } from "lucide-react";
import PieChartComponent from "../Tax/PieChartComponent";
import { useLoader } from "../../../Context/LoaderContext";
import apiService from "../../../../apiService";
import { useLocation, useNavigate } from "react-router-dom";
import StackedBarGraph from "../../../Components/StackedBarGraph";
import {
  PageHeader,
  SubHeaderCard,
  CustomButton,
} from "../../../Components/NewLayout";

const LegalPrabhag = () => {
  const [activeView, setActiveView] = useState("table");
  const tableRef = useRef(null);
  const pieRef = useRef(null);
  const barRef = useRef(null);
  const [tableData, setTableData] = useState([]);
  const { setLoading } = useLoader();
  const [pieChartData, setPieChartData] = useState([]);
  const [barGraphData, setBarGraphData] = useState([]);
  const { user } = useAuth();
  const orgId = user?.data?.OrgId;
  const location = useLocation();
  const navigate = useNavigate();

  const { wardId, wardName } = location.state || {};

  const handleGoBack = () => {
    navigate("/propertydashboard");
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !wardId) return;

      try {
        setLoading(true);
        const payload = {
          Request1: `MobApp$MIS_legalillgal$${user.userId}$${orgId}~${wardId}~`,
          Request2: "",
          Request3: "",
          Request4: "",
          Request5: "",
          Request6: "",
          Request7: "",
        };

        const response = await apiService.post("generic-call", payload);
        const jsonData = response.data?.data?.jsondata || [];

        const totalRow = jsonData.reduce(
          (acc, cur) => {
            acc.legal_propcount += Number(cur.legal_propcount);
            acc.illlegal_propcount += Number(cur.illlegal_propcount);
            acc.total_propcount += Number(cur.total_propcount);
            return acc;
          },
          {
            zone_name: "एकूण",
            legal_propcount: 0,
            illlegal_propcount: 0,
            total_propcount: 0,
          }
        );

        setTableData([...jsonData, totalRow]);

        setPieChartData(
          jsonData.map((item) => ({
            name: item.zone_name,
            y: item.total_propcount,
          }))
        );

        setBarGraphData(
          jsonData.map((item) => ({
            category: item.zone_name,
            previous: Number(item.legal_propcount) || 0,
            current: Number(item.illlegal_propcount) || 0,
            total: Number(item.total_propcount) || 0,
          }))
        );

        tableRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center"
        })
      } catch (error) {
        console.error("Error fetching Legal/Illegal Zone data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, wardId]);

  const headers = ["Zone", "Legal", "Illegal", "Total"];

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      <PageHeader
        title="Legal & Illegal"
        subtitle="Property Tax"
        onBack={handleGoBack}
      />

      <SubHeaderCard
        subtitle="Zone"
        title={
          <span>
            <span
              className="text-white/80 cursor-pointer hover:underline"
              onClick={() => navigate("/LegalIllegal")}
            >
              All Wards
            </span>{" "}
            {wardName ? `/ ${wardName}` : ""}
          </span>
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
          <Table
            headers={headers}
            data={tableData}
            keyMapping={{
              Zone: "zone_name",
              Legal: "legal_propcount",
              Illegal: "illlegal_propcount",
              Total: "total_propcount",
            }}
            pagination={true}
            rowsPerPage={10}
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
                    navigate("/LegalBlock", {
                      state: {
                        wardId: wardId,
                        wardName: wardName,
                        zoneId: row.zone_id,
                        zoneName: row.zone_name,
                      },
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

export default LegalPrabhag;

