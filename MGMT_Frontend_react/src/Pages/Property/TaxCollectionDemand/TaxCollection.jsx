import React, { useState, useEffect, useRef } from "react";
import Table from "../../../Components/Table/Table";
import {
  Table as TableIcon,
  PieChart,
  BarChart3,
} from "lucide-react";
import PieChartComponent from "../../Property/Tax/PieChartComponent";
import StackedBarGraph from "../../../Components/StackedBarGraph";
import apiService from "../../../../apiService";
import { useNavigate } from "react-router-dom";
import { useLoader } from "../../../Context/LoaderContext";
import { useAuth } from "../../../Context/AuthContext";
import {
  PageHeader,
  SubHeaderCard,
  CustomButton,
} from "../../../Components/NewLayout";

const TaxCollection = () => {
  const { setLoading } = useLoader();
  const { user } = useAuth();
  const userid = user?.userId || "";
  const orgId = user?.data?.OrgId;
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/propertydashboard");
  };

  const [tableHeader, setTableHeader] = useState([
    "प्रभाग",
    "मागील",
    "चालू",
    "एकूण",
  ]);
  const tableRef = useRef(null);
  const pieRef = useRef(null);
  const barRef = useRef(null);
  const [tableData, setTableData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [activeView, setActiveView] = useState("table");

  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await apiService.post("generic-call", {
        Request1: `MobApp$PrabhagZonewise_Demand$${userid}$${orgId}~~`,
        Request2: "",
        Request3: "",
        Request4: "",
        Request5: "",
        Request6: "",
        Request7: "",
      });

      if (response?.data?.data?.jsondata) {
        const result = response.data.data.jsondata.map((item) => ({
          prabhag: item.ward_name,
          mvalue: item.arrears,
          cvalue: item.current,
          tvalue: item.total,
          wardId: item.ward_id,
        }));

        const totalRow = result.reduce(
          (acc, cur) => {
            acc.mvalue += Number(cur.mvalue) || 0;
            acc.cvalue += Number(cur.cvalue) || 0;
            acc.tvalue += Number(cur.tvalue) || 0;
            return acc;
          },
          {
            prabhag: "एकूण",
            mvalue: 0,
            cvalue: 0,
            tvalue: 0,
          }
        );

        setTableData([...result, totalRow]);

        setPieData(
          result.map((item) => ({
            name: item.prabhag,
            y: Number(item.tvalue),
          }))
        );

        setBarData(
          result.map((item) => ({
            category: item.prabhag,
            previous: Number(item.mvalue),
            current: Number(item.cvalue),
          }))
        );
        tableRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center"
        })
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userid) return;
    fetchData();
  }, [userid]);

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      <PageHeader
        title="Wardwise Tax Demand"
        subtitle="Property Tax"
        onBack={handleGoBack}
      />

      <SubHeaderCard
        subtitle="Ward"
        title="All Wards"
        infoText="Yearly Demand (All amounts are shown in lakhs.)"
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
              प्रभाग: "prabhag",
              मागील: "mvalue",
              चालू: "cvalue",
              एकूण: "tvalue",
            }}
            pagination={true}
            rowsPerPage={10}
            customCellRenderer={{
              prabhag: (value, row) => {
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
                      navigate("/TCDPrabhag", {
                        state: { ward_id: row.wardId, wardName: row.prabhag },
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
            yAxisTitle="Amount"
            seriesConfig={[
              { name: "मागील", key: "previous", color: "#3b82f6" },
              { name: "चालू", key: "current", color: "#10b981" },
            ]}
          />
          {/* )} */}
        </div>
      </section>

    </div>
  );
};

export default TaxCollection;

