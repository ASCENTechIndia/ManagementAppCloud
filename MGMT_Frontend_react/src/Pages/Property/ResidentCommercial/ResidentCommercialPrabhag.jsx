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

const ResidentCommericalPrabhag = () => {
  const { setLoading } = useLoader();
  const navigate = useNavigate();
  const { user } = useAuth();
  const orgId = user?.data?.OrgId;
  const userid = user?.userId || "";
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
    navigate("/propertydashboard");
  };

  const headers = ["Zone", "Resident", "Commercial", "Total"];

  useEffect(() => {
    if (!userid || !wardId) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiService.post("generic-call", {
          Request1: `MobApp$MIS_ResNonRes$${userid}$${orgId}~${wardId}`,
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
            zone: item.zone_name,
            mvalue: item.Residential_propcount,
            cvalue: item.Nonresidential_propcount,
            tvalue: item.total_propcount,
            zoneId: item.zone_id,
          }));

          const totalRow = formattedData.reduce(
            (acc, cur) => {
              acc.mvalue += cur.mvalue;
              acc.cvalue += cur.cvalue;
              acc.tvalue += cur.tvalue;
              return acc;
            },
            {
              zone: "Total",
              mvalue: 0,
              cvalue: 0,
              tvalue: 0,
            }
          );

          setTableData([...formattedData, totalRow]);

          setPieChartData(
            res.map((item) => ({
              name: item.zone_name,
              y: item.total_propcount,
            }))
          );

          setBarGraphData(
            res.map((item) => ({
              category: item.zone_name,
              previous: Number(item.Residential_propcount) || 0,
              current: Number(item.Nonresidential_propcount) || 0,
              total: Number(item.total_propcount) || 0,
            }))
          );

          tableRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center"
          })
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
        title="Resident & Commercial"
        subtitle="Property Tax"
        onBack={handleGoBack}
      />

      <SubHeaderCard
        subtitle="Zone"
        title={
          <span>
            <span
              className="text-white/80 cursor-pointer hover:underline"
              onClick={() => navigate("/ResidentCommerical")}
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
              Zone: "zone",
              Resident: "mvalue",
              Commercial: "cvalue",
              Total: "tvalue",
            }}
            pagination={true}
            rowsPerPage={10}
            customCellRenderer={{
              zone: (value, row) => (
                <span
                  style={{
                    cursor: row.zone === "Total" ? "default" : "pointer",
                    color: row.zone === "Total" ? "inherit" : "#007bff",
                    textDecoration: row.zone === "Total" ? "none" : "underline",
                  }}
                  onClick={() => {
                    if (row.zone !== "Total") {
                      navigate("/block-details", {
                        state: {
                          wardName,
                          wardId,
                          zoneId: row.zoneId,
                          zoneName: row.zone,
                        },
                      });
                    }
                  }}
                >
                  {value}
                </span>
              ),
            }}
          />
        </div>
      </section>
      {/* )} */}
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
              { name: "Resident", key: "previous", color: "#3b82f6" },
              { name: "Commercial", key: "current", color: "#10b981" },
            ]}
          />
          {/* )} */}
        </div>
      </section>
    </div>
  );
};

export default ResidentCommericalPrabhag;

