import React, { useState, useRef } from "react";
import { Formik, Form } from "formik";
import { Table as TableIcon, PieChart, BarChart3, Repeat } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDateForAPI } from "../../../utils/dateUtils";
import apiService from "../../../../apiService";
import TableComponent from "../../../Components/TableComponent";
import PieChartComp from "../../../Components/PieChart";
import BarGraphComponent from "../../../Components/BarGraphComponent";
import CalenderComponent from "../../../Components/CalenderComponent";
import { useLoader } from "../../../Context/LoaderContext";
import { useAuth } from "../../../Context/AuthContext";
import {
  PageHeader,
  FormLayoutCard,
  CalendarInput,
  SubHeaderCard,
  CustomButton,
} from "../../../Components/NewLayout";

const Daindin = () => {
  const { setLoading } = useLoader();
  const { user } = useAuth();
  const userId = user?.userId;
  const orgId = user?.data?.OrgId;
  const navigate = useNavigate();
  const [initialView, setInitialView] = useState(false);
  const [tableHeader, setTableHeader] = useState([
    "Ward",
    "Arrears",
    "Current",
    "Total",
  ]);
  const [tableKeyMapping, setTableKeyMapping] = useState({
    Ward: "ward_name",
    Arrears: "arrears",
    Current: "current",
    Total: "total",
  });
  const [formDate, setFormDate] = useState({
    from: new Date(),
    to: new Date(),
  });
  const tableRef = useRef(null);
  const pieRef = useRef(null);
  const barRef = useRef(null);
  const [chartData, setChartData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [barGraphData, setBarGraphData] = useState([]);
  const [ward_Id, setWard_Id] = useState();
  const [initialValues] = useState({
    from: new Date(),
    to: new Date(),
  });

  const [activeView, setActiveView] = useState("table");
  const [selectedPath, setSelectedPath] = useState(["All Wards"]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [dataCache, setDataCache] = useState({});

  const handleSubmit = async (values) => {
    if (!userId) {
      alert("UserId is not set");
      return;
    }
    try {
      setLoading(true);
      setActiveView("table");
      const payload = {
        Request1: `MobApp$PrabhagZoneWise_Collection$${userId}$${orgId}~~~${formatDateForAPI(
          values.from
        )}~${formatDateForAPI(values.to)}`,
        Request2: "",
        Request3: "",
        Request4: "",
        Request5: "",
        Request6: "",
        Request7: "",
      };
      console.log("mgmt", payload);
      const res = await apiService.post("generic-call", payload);
      if (
        Array.isArray(res?.data?.data?.jsondata) &&
        res?.data?.data?.jsondata?.length > 0
      ) {
        setInitialView(true);
        const data = res?.data?.data?.jsondata;
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
        setTableData([]);
        setBarGraphData([]);
        setChartData([]);
        alert("No data found");
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

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
          Request1: `MobApp$PrabhagZoneWise_Collection$${userId}$${orgId}~${wardId}~~${formatDateForAPI(
            formDate.from
          )}~${formatDateForAPI(formDate.to)}`,
          Request2: "",
          Request3: "",
          Request4: "",
          Request5: "",
          Request6: "",
          Request7: "",
        };
        const res = await apiService.post("generic-call", payload);

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
          })
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
      setActiveView("table");
      setSelectedPath(newPath);
      setCurrentLevel(newLevel);

      try {
        setLoading(true);
        const payload = {
          Request1: `MobApp$PrabhagZoneWise_Collection$${userId}$${orgId}~${ward_Id}~${zoneId}~${formatDateForAPI(
            formDate.from
          )}~${formatDateForAPI(formDate.to)}`,
          Request2: "",
          Request3: "",
          Request4: "",
          Request5: "",
          Request6: "",
          Request7: "",
        };
        const res = await apiService.post("generic-call", payload);
        if (
          Array.isArray(res?.data?.data?.jsondata) &&
          res?.data?.data?.jsondata?.length > 0
        ) {
          const data = res?.data?.data?.jsondata;

          setTableHeader(["Block", "Arrears", "Current", "Total"]);
          setTableKeyMapping({
            Block: "block_name",
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
          })
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
      setActiveView("table");
      if (index === 0) {
        setTableHeader(["Ward", "Arrears", "Current", "Total"]);
        setTableKeyMapping({
          Ward: "ward_name",
          Arrears: "arrears",
          Current: "current",
          Total: "total",
        });
      } else if (index === 1) {
        setTableHeader(["Zone", "Arrears", "Current", "Total"]);
        setTableKeyMapping({
          Zone: "zone_name",
          Arrears: "arrears",
          Current: "current",
          Total: "total",
        });
      } else if (index === 2) {
        setTableHeader(["Block", "Arrears", "Current", "Total"]);
        setTableKeyMapping({
          Block: "block_name",
          Arrears: "arrears",
          Current: "current",
          Total: "total",
        });
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
          })
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
          })
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
          })
        }
      } else {
        setTableData([]);
        setBarGraphData([]);
        setChartData([]);
      }
    }
  };

  const handleGoBack = () => {
    navigate("/propertydashboard");
  };

  const totalAmount = tableData.reduce(
    (sum, item) => sum + (Number(item.total) || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      {/* Header section matching NewLayout design */}
      <PageHeader
        title="Daily Collection"
        subtitle="Property Tax"
        onBack={handleGoBack}
      />

      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ setFieldValue, values, handleSubmit: formikSubmit }) => (
          <Form onSubmit={formikSubmit}>
            {/* Floating Form Layout Card */}
            <FormLayoutCard
              onSubmit={formikSubmit}
              actionButtonText="पहा"
              actionButtonIcon={<Repeat className="w-5 h-5" />}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CalendarInput label="दिनांक पासून">
                  <CalenderComponent
                    name="from"
                    selectedDate={values.from}
                    autoSelectToday={false}
                    setSelectedDate={(date) => {
                      setFormDate((prev) => ({ ...prev, from: date }));
                      setFieldValue("from", date);
                    }}
                  />
                </CalendarInput>

                <CalendarInput label="दिनांक पर्यंत">
                  <CalenderComponent
                    name="to"
                    selectedDate={values.to}
                    autoSelectToday={false}
                    setSelectedDate={(date) => {
                      setFormDate((prev) => ({ ...prev, to: date }));
                      setFieldValue("to", date);
                    }}
                  />
                </CalendarInput>
              </div>
            </FormLayoutCard>

            {/* Result Header & View Toggle Buttons */}
            {initialView && (
              <>
                <SubHeaderCard
                  subtitle={
                    currentLevel === 0
                      ? "Ward"
                      : currentLevel === 1
                        ? "Zone"
                        : "Block"
                  }
                  title={
                    <div className="flex items-center space-x-2 flex-wrap">
                      {selectedPath.map((pathItem, index) => (
                        <div key={index} className="flex items-center">
                          {index > 0 && (
                            <span className="mx-2 text-white/60">/</span>
                          )}
                          <span
                            className={`${index < currentLevel
                              ? "text-white/80 cursor-pointer hover:underline"
                              : "text-white font-semibold"
                              }`}
                            onClick={() => handlePathClick(index)}
                          >
                            {pathItem}
                          </span>
                        </div>
                      ))}
                    </div>
                  }
                  infoText={`${formatDateForAPI(values.from)} - ${formatDateForAPI(
                    values.to
                  )} (All amounts in lakhs)`}
                  value={
                    totalAmount > 0 ? `₹${totalAmount.toFixed(2)} L` : "Total"
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
              </>
            )}
          </Form>
        )}
      </Formik>

      {/* Content Section: Table / Pie / Bar Graph */}
      {initialView && (
        <>
          <section className="container mx-auto mt-4 mb-5 px-4" ref={tableRef}>
            <div className="rounded-[24px] bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
              {/* {activeView === "table" && ( */}
              <TableComponent
                data={tableData}
                headers={tableHeader}
                firstColumnClickable={currentLevel <= 1}
                keyMapping={tableKeyMapping}
                onCellClick={handleTableClick}
                pagination={true}
                rowsPerPage={10}
              />
              {/* )} */}

              {/* {activeView === "pie" && (
                <PieChartComp
                  data={chartData}
                  title="Tax"
                  description="Tax report"
                />

              )}

              {activeView === "bar" && (
                <div className="mt-5">
                  <BarGraphComponent
                    data={barGraphData}
                    title="Wardwise Daily Collection"
                    description="Daily collection report"
                  />
                </div>

              )} */}
            </div>
          </section>
          <section className="container mx-auto mt-4 mb-5 px-4" ref={pieRef}>
            <div className="rounded-[24px] bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
              <PieChartComp
                data={chartData}
                title="Tax"
                description="Tax report"
              />
            </div>
          </section>
          <section className="container mx-auto mt-4 mb-5 px-4" ref={barRef}>
            <div className="rounded-[24px] bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
              <BarGraphComponent
                data={barGraphData}
                title="Wardwise Daily Collection"
                description="Daily collection report"
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Daindin;

