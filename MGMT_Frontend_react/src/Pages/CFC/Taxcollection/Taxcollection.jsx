import React, { useRef, useState } from "react";
import { Form, Formik } from "formik";
import { Table as TableIcon, PieChart, BarChart3, Repeat } from "lucide-react";
import CalenderComponent from "../../../Components/CalenderComponent";
import { formatDateForAPI } from "../../../utils/dateUtils";
import apiService from "../../../../apiService";
import PieChartComp from "../../../Components/PieChart";
import BarGraphComponent from "../../../Components/BarGraphComponent";
import { useLoader } from "../../../Context/LoaderContext";
import { useAuth } from "../../../Context/AuthContext";
import Table from "../../../Components/Table/Table";
import { useNavigate } from "react-router-dom";
import {
  PageHeader,
  FormLayoutCard,
  CalendarInput,
  SubHeaderCard,
  CustomButton,
} from "../../../Components/NewLayout";

const Taxcollection = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const orgId = user?.data?.OrgId;
  const flag = import.meta.env.VITE_FLAG;
  const { setLoading } = useLoader();
  const [initialView, setInitialView] = useState(false);
  const [tableHeader] = useState(["Zone", "Total"]);
  const [tableKeyMapping] = useState({
    Zone: "zone",
    Total: "total",
  });
  const [chartData, setChartData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [barGraphData, setBarGraphData] = useState([]);
  const [initialValues] = useState({
    from: new Date(),
    to: new Date(),
  });
  const tableRef = useRef(null);
  const pieRef = useRef(null);
  const barRef = useRef(null);
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("table");

  const handleSubmit = async (values) => {
    if (!userId) {
      alert("UserId is not set");
      return;
    }
    try {
      setLoading(true);
      const payload = {
        Request1: `${flag}$cfcPrabhagZoneWise_Collection$${userId}$${orgId}~~~${formatDateForAPI(
          values.from,
        )}~${formatDateForAPI(values.to)}`,
        Request2: "",
        Request3: "",
        Request4: "",
        Request5: "",
        Request6: "",
        Request7: "",
      };

      const res = await apiService.post("WTgeneric-call", payload);
      const resData = res?.data?.data;

      if (typeof resData === "string" && resData.includes("#SUCCESS#")) {
        setInitialView(true);
        const responseStr = resData.replace(/^respon:/, "");
        const parts = responseStr.split("#SUCCESS#");
        if (parts.length > 1) {
          const dataPart = parts[1];
          const tildeParts = dataPart.split("~");
          if (tildeParts.length > 1) {
            const itemsStr = tildeParts[1];
            const itemsList = itemsStr.split("$");
            const data = [];
            for (let i = 0; i < itemsList.length; i += 2) {
              if (itemsList[i]) {
                data.push({
                  zone: itemsList[i],
                  total: itemsList[i + 1] || "0",
                });
              }
            }

            const totalSum = data.reduce(
              (acc, item) => acc + Number(item.total || 0),
              0,
            );

            const tableDataWithTotal = [
              ...data,
              {
                zone: "Total",
                total: totalSum.toFixed(2),
              },
            ];
            setTableData(tableDataWithTotal);

            const bothChartData = data.map((item) => ({
              value: Number(item.total),
              label: item.zone,
            }));
            setChartData(bothChartData);
            setBarGraphData(bothChartData);
          } else {
            setTableData([]);
            setBarGraphData([]);
            setChartData([]);
            alert("No data found");
          }
        } else {
          setTableData([]);
          setBarGraphData([]);
          setChartData([]);
          alert("No data found");
        }
      } else if (
        Array.isArray(resData?.jsondata) &&
        resData?.jsondata?.length > 0
      ) {
        setInitialView(true);
        const data = resData.jsondata.map((data) => ({
          zone: data.ward_name || data.zone || data.prabhag || "",
          total: data.total || data.tot,
        }));

        const totalSum = data.reduce(
          (acc, item) => acc + Number(item.total || 0),
          0,
        );
        const tableDataWithTotal = [
          ...data,
          {
            zone: "Total",
            total: totalSum.toFixed(2),
          },
        ];
        setTableData(tableDataWithTotal);

        const bothChartData = data.map((data) => ({
          value: Number(data.total),
          label: data.zone,
        }));
        setChartData(bothChartData);
        setBarGraphData(bothChartData);
        setTimeout(() => {
          tableRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }, 100);
      } else {
        setTableData([]);
        setBarGraphData([]);
        setChartData([]);
        alert("No data found");
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/CfcDashBoard");
  };

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      <PageHeader
        title="Tax Collection"
        subtitle="CFC Tax"
        onBack={handleGoBack}
      />

      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ setFieldValue, values, handleSubmit: formikSubmit }) => {
          return (
            <Form onSubmit={formikSubmit}>
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
                        setFieldValue("to", date);
                      }}
                    />
                  </CalendarInput>
                </div>
              </FormLayoutCard>

              {initialView && (
                <>
                  <SubHeaderCard
                    subtitle="Zone"
                    title="All Zones"
                    infoText={`${formatDateForAPI(values.from)} - ${formatDateForAPI(values.to)} (All amounts in lakhs)`}
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
          );
        }}
      </Formik>

      {initialView && (
        <>

          <section className="container mx-auto mt-4 mb-5 px-4" ref={tableRef}>
            <div className="rounded-[24px] bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
              {/* {activeView === "table" && ( */}
              <Table
                data={tableData}
                headers={tableHeader}
                keyMapping={tableKeyMapping}
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
                title="Zonewise Daily Collection"
                description="Daily collection report"
              />
              {/* )} */}
            </div>
          </section>
        </>
      )}
    </div>

  );
};

export default Taxcollection;
