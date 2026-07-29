import React, { useEffect, useRef, useState } from "react";
import TableComponent from "../../../Components/TableComponent";
import { Table as TableIcon, PieChart, BarChart3 } from "lucide-react";
import apiService from "../../../../apiService";
import PieChartComp from "../../../Components/PieChart";
import BarGraphComponent from "../../../Components/BarGraphComponent";
import { useLoader } from "../../../Context/LoaderContext";
import { useAuth } from "../../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  PageHeader,
  SubHeaderCard,
  CustomButton,
} from "../../../Components/NewLayout";

const WardWiseTaxDemand = () => {
  const { setLoading } = useLoader();
  const { user } = useAuth();
  const userId = user?.userId;
  const orgId = user?.data?.OrgId;
  const tableRef = useRef(null);
  const pieRef = useRef(null);
  const barRef = useRef(null);
  const navigate = useNavigate();
  const [initialView, setInitialView] = useState(false);
  const [tableHeader, setTableHeader] = useState([
    "Ward",
    "Arrears",
    "Current",
    "Total",
  ]);
  const [tableKeyMapping, setTableKeyMapping] = useState({
    Ward: "wardname",
    Arrears: "arrears",
    Current: "current",
    Total: "total",
  });
  const [chartData, setChartData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [barGraphData, setBarGraphData] = useState([]);
  const [ward_Id, setWard_Id] = useState();

  const [activeView, setActiveView] = useState("table");
  const [selectedPath, setSelectedPath] = useState(["All Wards"]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [dataCache, setDataCache] = useState({});

  const handleTableClick = async (cellValue, rowIndex, wardId, zoneId) => {
    if (currentLevel === 0) {
      if (!userId || !wardId) {
        alert("UserId or WardId is not set");
        return;
      }
      setWard_Id(wardId);
      setActiveView("table");
      const newLevel = 1;
      const newPath = [...selectedPath.slice(0, newLevel), cellValue];

      setSelectedPath(newPath);
      setCurrentLevel(newLevel);

      try {
        setLoading(true);
        const payload = {
          Request1: `MobApp$Wt_WardZonewise_Demand$${userId}$${orgId}~${wardId}~`,
          Request2: "",
          Request3: "",
          Request4: "",
          Request5: "",
          Request6: "",
          Request7: "",
        };
        const res = await apiService.post("WTgeneric-call", payload);

        if (
          Array.isArray(res?.data?.data?.jsondata) &&
          res?.data?.data?.jsondata?.length > 0
        ) {
          const data = res?.data?.data?.jsondata;
          setTableHeader(["Zone", "Arrears", "Current", "Total"]);
          setTableKeyMapping({
            Zone: "zone_name",
            Arrears: "arrears",
            Current: "current",
            Total: "total",
          });
          setTableData(data);
          const bothChartData = data.map((data) => ({
            value: Number(data.total),
            label: data.zone_name,
          }));
          setChartData(bothChartData);
          setBarGraphData(bothChartData);
          setDataCache((prev) => ({ ...prev, [newLevel]: data }));
          tableRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        } else {
          setTableData([]);
          setBarGraphData([]);
          setChartData([]);
          alert("No data found");
        }
      } catch (error) {
        console.error("Level 1 API error:", error);
        alert("Error fetching zone data: " + error.message);
      } finally {
        setLoading(false);
      }
    } else if (currentLevel === 1) {
      if (!userId || !ward_Id || !zoneId) {
        alert("UserId or WardId or ZoneId is not set");
        return;
      }
      const newLevel = 2;
      const newPath = [...selectedPath.slice(0, newLevel), cellValue];
      setSelectedPath(newPath);
      setCurrentLevel(newLevel);
      setActiveView("table");

      try {
        setLoading(true);
        const payload = {
          Request1: `MobApp$Wt_WardZonewise_Demand$${userId}$${orgId}~${ward_Id}~${zoneId}`,
          Request2: "",
          Request3: "",
          Request4: "",
          Request5: "",
          Request6: "",
          Request7: "",
        };
        const res = await apiService.post("WTgeneric-call", payload);
        if (
          Array.isArray(res?.data?.data?.jsondata) &&
          res?.data?.data?.jsondata?.length > 0
        ) {
          const data = res?.data?.data?.jsondata;

          setTableHeader(["Zone", "Arrears", "Current", "Total"]);
          setTableKeyMapping({
            Zone: "zone_name",
            Arrears: "arrears",
            Current: "current",
            Total: "total",
          });
          setTableData(data);
          const bothChartData = data.map((data) => ({
            value: Number(data.total),
            label: data.block_name,
          }));
          setChartData(bothChartData);
          setBarGraphData(bothChartData);
          setDataCache((prev) => ({ ...prev, [newLevel]: data }));
          tableRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        } else {
          setTableData([]);
          setBarGraphData([]);
          setChartData([]);
          alert("No data found");
        }
      } catch (error) {
        console.error("Level 1 API error:", error);
        alert("Error fetching zone data: " + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePathClick = (index) => {
    if (index < currentLevel) {
      setSelectedPath(selectedPath.slice(0, index + 1));
      setCurrentLevel(index);

      if (index === 0) {
        setTableHeader(["Ward", "Arrears", "Current", "Total"]);
        setTableKeyMapping({
          Ward: "wardname",
          Arrears: "arrears",
          Current: "current",
          Total: "total",
        });
        setActiveView("table");
      } else if (index === 1) {
        setTableHeader(["Zone", "Arrears", "Current", "Total"]);
        setTableKeyMapping({
          Zone: "zone_name",
          Arrears: "arrears",
          Current: "current",
          Total: "total",
        });
        setActiveView("table");
      } else if (index === 2) {
        setTableHeader(["Zone", "Arrears", "Current", "Total"]);
        setTableKeyMapping({
          Zone: "zone_name",
          Arrears: "arrears",
          Current: "current",
          Total: "total",
        });
        setActiveView("table");
      }
      const cachedData = dataCache[index];
      if (cachedData) {
        setTableData(cachedData);
        if (index === 0) {
          const bothChartData = cachedData.map((data) => ({
            value: Number(data.total),
            label: data.ward_name,
          }));
          setChartData(bothChartData);
          setBarGraphData(bothChartData);
          tableRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        } else if (index === 1) {
          const bothChartData = cachedData.map((data) => ({
            value: Number(data.total),
            label: data.zone_name,
          }));
          setChartData(bothChartData);
          setBarGraphData(bothChartData);
          tableRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        } else if (index === 2) {
          const bothChartData = cachedData.map((data) => ({
            value: Number(data.total),
            label: data.block_name,
          }));
          setChartData(bothChartData);
          setBarGraphData(bothChartData);
          tableRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }
      } else {
        setTableData([]);
        setBarGraphData([]);
        setChartData([]);
      }
    }
  };

  const handleGoBack = () => {
    navigate("/waterdashboard");
  };

  const fetchData = async () => {
    if (!userId) {
      alert("UserId is not set");
      return;
    }
    try {
      setInitialView(true);
      setLoading(true);
      const payload = {
        Request1: `CollectionCenter$WTPrabhagWise_Demand$${userId}$${orgId}~~`,
        Request2: "",
        Request3: "",
        Request4: "",
        Request5: "",
        Request6: "",
        Request7: "",
      };
      const res = await apiService.post("WTgeneric-call", payload);
      // console.log(res);
      // return;
      if (
        Array.isArray(res?.data?.data?.jsondata) &&
        res?.data?.data?.jsondata?.length > 0
      ) {
        const data = res?.data?.data?.jsondata.map((item) => ({
          arrears: item.arrears,
          current: item.current,
          total: item.total,
          ulbid: item.ulbid,
          ward_id: item.wardid,
          wardname: item.wardname,
        }));

        setTableData(data);
        const bothChartData = data.map((data) => ({
          value: Number(data.total),
          label: data.ward_name,
        }));
        setChartData(bothChartData);
        setBarGraphData(bothChartData);

        setDataCache((prev) => ({ ...prev, 0: data }));
        tableRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      } else {
        alert("No data found");
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      <PageHeader
        title="Ward Wise Tax Demand"
        subtitle="Water Tax"
        onBack={handleGoBack}
      />

      <SubHeaderCard
        // subtitle="Path"
        title={
          <div className="flex items-center space-x-2">
            {selectedPath.map((pathItem, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && <span className="mx-2 text-white-400">/</span>}
                <span
                  className={`${index < currentLevel
                    ? "text-white-600 cursor-pointer hover:underline"
                    : "text-white-400"
                    }`}
                  onClick={() => handlePathClick(index)}
                >
                  {pathItem}
                </span>
              </div>
            ))}
          </div>
        }
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

      {initialView && (
        <>
          <section className="container mx-auto mt-4 mb-5 px-4" ref={tableRef}>
            <div className="rounded-[24px] bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
              {/* {activeView === "table" && ( */}
              <TableComponent
                data={tableData}
                headers={tableHeader}
                firstColumnClickable={currentLevel < 2 ? true : false}
                keyMapping={tableKeyMapping}
                onCellClick={handleTableClick}
                pagination={true}
                rowsPerPage={10}
              />
              {/* )} */}
            </div>
          </section>
          <section className="container mx-auto mt-4 mb-5 px-4" ref={pieRef}>
            <div className="rounded-[24px] bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
              {/* {activeView === "pie" && ( */}
              <PieChartComp
                data={chartData}
                title="Tax"
                description="Tax report"
              />
              {/* )} */}
            </div>
          </section>
          <section className="container mx-auto mt-4 mb-5 px-4" ref={barRef}>
            <div className="rounded-[24px] bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
              {/* {activeView === "bar" && ( */}
              <BarGraphComponent
                data={barGraphData}
                title="Ward Wise Tax Demand"
                description="Tax demand report"
              />
              {/* )} */}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default WardWiseTaxDemand;
