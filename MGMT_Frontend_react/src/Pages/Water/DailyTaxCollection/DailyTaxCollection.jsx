import React, { useRef, useState } from "react";
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

const DailyTaxCollection = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const orgId = user?.data?.OrgId;
  const { setLoading } = useLoader();
  const navigate = useNavigate();
  const tableRef = useRef(null);
  const pieRef = useRef(null);
  const barRef = useRef(null);
  const [initialView, setInitialView] = useState(false);
  const [activeView, setActiveView] = useState("table");
  const [tableHeader] = useState([
    "Ward",
    "Arrears",
    "Current",
    "Total",
  ]);
  const [tableKeyMapping] = useState({
    Ward: "ward_name",
    Arrears: "arrears",
    Current: "current",
    Total: "total",
  });

  const [chartData, setChartData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [barGraphData, setBarGraphData] = useState([]);
  const [initialValues] = useState({
    from: new Date(),
    to: new Date(),
  });

  const handleSubmit = async (values) => {
    if (!userId) {
      alert("UserId is not set");
      return;
    }
    try {
      setLoading(true);
      const payload = {
        Request1: `CollectionCenter$Daily_Wtcollection$${userId}$${orgId}~${formatDateForAPI(
          values.from
        )}~${formatDateForAPI(values.to)}`,
        Request2: "a",
        Request3: "a",
        Request4: "a",
        Request5: "a",
        Request6: "a",
        Request7: "a",
      };
      console.log("mgmt payload:", payload);
      const res = await apiService.post("WTgeneric-call", payload);
      // console.log(res);
      // return;
      if (
        Array.isArray(res?.data?.data?.jsondata) &&
        res?.data?.data?.jsondata?.length > 0
      ) {
        setInitialView(true);
        const data = res?.data?.data?.jsondata.map((dataItem) => ({
          ward_name: dataItem.wardname,
          arrears: dataItem._balamt,
          current: dataItem._curramt,
          total: dataItem._totalamt,
          wardId: dataItem.ward_id,
        }));

        setTableData(data);

        const bothChartData = data.map((dataItem) => ({
          value: Number(dataItem.total),
          label: dataItem.ward_name,
        }));
        setChartData(bothChartData);
        setBarGraphData(bothChartData);
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
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/waterdashboard");
  };

  const totalAmount = tableData.reduce(
    (sum, item) => sum + (Number(item.total) || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      {/* Header section matching NewLayout design */}
      <PageHeader
        title="Daily Tax Collection"
        subtitle="Water Tax"
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

            {/* Result Header & View Toggle Buttons */}
            {initialView && (
              <>
                <SubHeaderCard
                  subtitle="Ward"
                  title="All Wards"
                  infoText={`${formatDateForAPI(values.from)} - ${formatDateForAPI(values.to)} (All amounts in lakhs)`}
                  value={totalAmount > 0 ? `₹${totalAmount.toFixed(2)} L` : "Total"}
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
                title="Wardwise Daily Collection"
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

export default DailyTaxCollection;
