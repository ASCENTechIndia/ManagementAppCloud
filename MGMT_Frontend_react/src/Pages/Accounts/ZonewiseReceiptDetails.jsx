import React, { useState, useRef, useEffect } from "react";
import { Form, Formik } from "formik";
import Table from "../../Components/Table/Table";
import {
  Table as TableIcon,
  PieChart,
  BarChart3,
  Repeat,
  Receipt,
  ExternalLink,
  X,
  Info,
} from "lucide-react";
import CalenderComponent from "../../Components/CalenderComponent";
import { formatDateForAPI } from "../../utils/dateUtils";
import PieChartComponent from "../Property/Tax/PieChartComponent";
import StackedBarGraph from "../../Components/StackedBarGraph";
import apiService from "../../../apiService";
import { useLocation, useNavigate } from "react-router-dom";
import { useLoader } from "../../Context/LoaderContext";
import { useAuth } from "../../Context/AuthContext";
import {
  PageHeader,
  FormLayoutCard,
  CalendarInput,
  SubHeaderCard,
  CustomButton,
} from "../../Components/NewLayout";
import useAlert from "../../Components/CustomAlert/useAlert";

const ZonewiseReceiptDetails = () => {
  const { setLoading } = useLoader();
  const { user } = useAuth();
  const location = useLocation();
  const { showAlert, Alert } = useAlert(); 
  const userId = user?.userId || "";
  const orgId = user?.data?.OrgId || "";
  const flag = import.meta.env.VITE_FLAG || "MobApp";
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState(location.state || {
    from: "",
    to: ""
  })

  const handleGoBack = () => {
    navigate("/Accounts");
  };

  // References for smooth scrolling & views
  const tableRef = useRef(null);
  const pieRef = useRef(null);
  const barRef = useRef(null);

  const [initialView, setInitialView] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [barGraphData, setBarGraphData] = useState([]);
  const [activeView, setActiveView] = useState("table");

  const [initialValues] = useState({
    from: formValues?.from || new Date(),
    to: formValues?.to || new Date(),
  });

  const [dateRangeText, setDateRangeText] = useState("");

  // Modal State for Link Click
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [tableHeader] = useState([
    "Zone",
    "Authorized Receipts",
    "Pending Receipts",
    "Authorized Amount (₹)",
    "Pending Amount (₹)",
    "Total Amount (₹)",
  ]);

  const [tableKeyMapping] = useState({
    "Zone": "prabhagname",
    "Authorized Receipts": "authorized_receipts",
    "Pending Receipts": "pending_receipts",
    "Authorized Amount (₹)": "auth_amount_formatted",
    "Pending Amount (₹)": "pend_amount_formatted",
    "Total Amount (₹)": "total_amount_formatted",
  });

  const handleSubmit = async (values) => {
    if (!userId) {
      showAlert("UserId is not set", "warning");
      return;
    }

    try {
      setLoading(true);

      const fromDateStr = formatDateForAPI(values.from);
      const toDateStr = formatDateForAPI(values.to);
      setDateRangeText(`${fromDateStr} - ${toDateStr}`);

      const payload = {
        Request1: `${flag}$ACC_RECDATA$${userId}$${orgId}~${fromDateStr}~${toDateStr}~-1`,
        Request2: "",
        Request3: "",
        Request4: "",
        Request5: "",
        Request6: "",
        Request7: "",
      };

      // Call API
      let res = null;
      try {
        res = await apiService.post("WTgeneric-call", payload);
      } catch (e) {
        res = await apiService.post("generic-call", payload);
      }

      const resData = res?.data?.data;
      let rawList = [];

      if (Array.isArray(resData?.jsondata)) {
        rawList = resData.jsondata;
      } else if (typeof resData === "string" && resData.includes("#SUCCESS#")) {
        const responseStr = resData.replace(/^respon:/, "");
        const parts = responseStr.split("#SUCCESS#");
        if (parts.length > 1) {
          const dataPart = parts[1];
          const tildeParts = dataPart.split("~");
          if (tildeParts.length > 1) {
            const itemsStr = tildeParts[1];
            const itemsList = itemsStr.split("$");
            for (let i = 0; i < itemsList.length; i += 5) {
              if (itemsList[i]) {
                rawList.push({
                  prabhagname: itemsList[i],
                  authorized_receipts: itemsList[i + 1] || "0",
                  pending_receipts: itemsList[i + 2] || "0",
                  authorized_receipt_amount: itemsList[i + 3] || "0",
                  pending_receipt_amount: itemsList[i + 4] || "0",
                });
              }
            }
          }
        }
      }

      if (rawList.length > 0) {
        setInitialView(true);

        const processed = rawList.map((item) => {
          const authCount = Number(item.authorized_receipts) || 0;
          const pendCount = Number(item.pending_receipts) || 0;
          const authAmt = Number(item.authorized_receipt_amount) || 0;
          const pendAmt = Number(item.pending_receipt_amount) || 0;
          const totalCount = authCount + pendCount;
          const totalAmt = authAmt + pendAmt;

          return {
            ...item,
            prabhagname: item.prabhagname || "ALL",
            authorized_receipts: authCount,
            pending_receipts: pendCount,
            authorized_receipt_amount: authAmt,
            pending_receipt_amount: pendAmt,
            total_receipts: totalCount,
            total_amount: totalAmt,
            auth_amount_formatted: `₹ ${authAmt.toLocaleString("en-IN")}`,
            pend_amount_formatted: `₹ ${pendAmt.toLocaleString("en-IN")}`,
            total_amount_formatted: `₹ ${totalAmt.toLocaleString("en-IN")}`,
          };
        });

        let finalTableData = processed;

        if (processed.length > 1) {
          const totalAuthCount = processed.reduce(
            (sum, item) => sum + item.authorized_receipts,
            0
          );
          const totalPendCount = processed.reduce(
            (sum, item) => sum + item.pending_receipts,
            0
          );
          const totalAuthAmt = processed.reduce(
            (sum, item) => sum + item.authorized_receipt_amount,
            0
          );
          const totalPendAmt = processed.reduce(
            (sum, item) => sum + item.pending_receipt_amount,
            0
          );
          const grandTotalAmt = totalAuthAmt + totalPendAmt;

          const totalRow = {
            prabhagname: "Total",
            authorized_receipts: totalAuthCount,
            pending_receipts: totalPendCount,
            authorized_receipt_amount: totalAuthAmt,
            pending_receipt_amount: totalPendAmt,
            total_amount: grandTotalAmt,
            auth_amount_formatted: `₹ ${totalAuthAmt.toLocaleString("en-IN")}`,
            pend_amount_formatted: `₹ ${totalPendAmt.toLocaleString("en-IN")}`,
            total_amount_formatted: `₹ ${grandTotalAmt.toLocaleString("en-IN")}`,
          };
          finalTableData = [...processed, totalRow];
        }

        setTableData(finalTableData);

        // Chart Data setup
        if (processed.length === 1 && (processed[0].prabhagname === "ALL" || processed[0].prabhagname === "All")) {
          setChartData([
            { name: "Authorized Amount", y: processed[0].authorized_receipt_amount },
            { name: "Pending Amount", y: processed[0].pending_receipt_amount },
          ]);
        } else {
          setChartData(
            processed.map((item) => ({
              name: item.prabhagname,
              y: item.total_amount,
            }))
          );
        }

        setBarGraphData(
          processed.map((item) => ({
            category: item.prabhagname,
            authorized: item.authorized_receipt_amount,
            pending: item.pending_receipt_amount,
          }))
        );

        setTimeout(() => {
          tableRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      } else {
        setTableData([]);
        setChartData([]);
        setBarGraphData([]);
        showAlert("No data found", "error");
      }
    } catch (error) {
      console.error("Error fetching Zonewise Receipt Details:", error);
      showAlert(error.message || "Failed to fetch data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLinkClick = (row, formValues) => {
    const pName = (row.prabhagname || "").toUpperCase();
    if (pName === "ALL" || pName === "ALL ZONES" || pName === "TOTAL") {
      const fromDateStr = formatDateForAPI(formValues?.from || initialValues.from);
      const toDateStr = formatDateForAPI(formValues?.to || initialValues.to);

      navigate("/AllZonesDetails", {
        state: {
          from: formValues?.from || initialValues.from,
          to: formValues?.to || initialValues.to,
          fromDateStr,
          toDateStr,
        },
      });
    } else {
      setSelectedRow(row);
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    // if (formValues.from === "" || formValues.to === "") return;

    if (formValues.from !== "" && formValues.to !== "") {
      handleSubmit(formValues);
    }
  }, [formValues]);

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-8">
      {/* Page Header */}
      <PageHeader
        title="Zone wise Receipt Details"
        subtitle="Accounts"
        onBack={handleGoBack}
      />
      <Alert />
      {/* From Date - To Date Form Layout Card */}
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
                    subtitle="Zone / Prabhag"
                    title="All Zones"
                    infoText={`${dateRangeText} (All receipt details)`}
                    className="mt-4"
                  />

                  {/* View Switcher Toggle Buttons */}
                  <section className="container mx-auto mt-4 px-4">
                    <div className="flex justify-center gap-4">
                      <CustomButton
                        variant="view-toggle"
                        active={activeView === "table"}
                        onClick={() => {
                          setActiveView("table");
                          tableRef.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                        }}
                        icon={<TableIcon className="w-6 h-6" />}
                        title="Table View"
                      />

                      <CustomButton
                        variant="view-toggle"
                        active={activeView === "pie"}
                        onClick={() => {
                          setActiveView("pie");
                          pieRef.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                        }}
                        icon={<PieChart className="w-6 h-6" />}
                        title="Pie Chart View"
                      />

                      <CustomButton
                        variant="view-toggle"
                        active={activeView === "bar"}
                        onClick={() => {
                          setActiveView("bar");
                          barRef.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                        }}
                        icon={<BarChart3 className="w-6 h-6" />}
                        title="Bar Chart View"
                      />
                    </div>
                  </section>

                  {/* Table Section */}
                  <section className="container mx-auto mt-4 mb-5 px-4" ref={tableRef}>
                    <div className="rounded-[24px] bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
                      <Table
                        headers={tableHeader}
                        data={tableData}
                        keyMapping={tableKeyMapping}
                        pagination={true}
                        rowsPerPage={10}
                        customCellRenderer={{
                          prabhagname: (value, row) => {
                            if (value === "Total" || value === "एकूण") {
                              return (
                                <span className="font-bold text-gray-900">
                                  {value}
                                </span>
                              );
                            }
                            return (
                              <button
                                type="button"
                                onClick={() => handleLinkClick(row, values)}
                                className="inline-flex items-center gap-1.5 text-blue-600 font-semibold underline hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-all focus:outline-none"
                                title={`Click to view details for ${value}`}
                              >
                                {value}
                              </button>
                            );
                          },
                        }}
                      />
                    </div>
                  </section>

                  {/* Pie Chart Section */}
                  <section className="container mx-auto mt-4 mb-5 px-4" ref={pieRef}>
                    <div className="rounded-[24px] bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
                      <PieChartComponent
                        data={chartData}
                        title="Authorized vs Pending Receipts Amount"
                      />
                    </div>
                  </section>

                  {/* Bar Chart Section */}
                  <section className="container mx-auto mt-4 mb-5 px-4" ref={barRef}>
                    <div className="rounded-[24px] bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
                      <StackedBarGraph
                        data={barGraphData}
                        title="Authorized vs Pending Receipts by Zone"
                        yAxisTitle="Amount (₹)"
                        seriesConfig={[
                          {
                            name: "Authorized Amount",
                            key: "authorized",
                            color: "#10b981",
                          },
                          {
                            name: "Pending Amount",
                            key: "pending",
                            color: "#f59e0b",
                          },
                        ]}
                      />
                    </div>
                  </section>
                </>
              )}
            </Form>
          );
        }}
      </Formik>

      {/* Details Modal when clicking any row link */}
      {isModalOpen && selectedRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Prabhag Details: {selectedRow.prabhagname}
                </h3>
                <p className="text-xs text-gray-500">
                  Receipt Summary Breakdown ({dateRangeText})
                </p>
              </div>
            </div>

            <div className="space-y-4 my-6">
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 flex justify-between items-center">
                <div>
                  <p className="text-xs text-emerald-700 font-semibold uppercase">
                    Authorized Receipts
                  </p>
                  <p className="text-lg font-bold text-emerald-900 mt-1">
                    {selectedRow.authorized_receipts} Receipts
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-emerald-700 font-semibold uppercase">
                    Amount
                  </p>
                  <p className="text-lg font-bold text-emerald-900 mt-1">
                    ₹
                    {selectedRow.authorized_receipt_amount?.toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 flex justify-between items-center">
                <div>
                  <p className="text-xs text-amber-700 font-semibold uppercase">
                    Pending Receipts
                  </p>
                  <p className="text-lg font-bold text-amber-900 mt-1">
                    {selectedRow.pending_receipts} Receipts
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-amber-700 font-semibold uppercase">
                    Amount
                  </p>
                  <p className="text-lg font-bold text-amber-900 mt-1">
                    ₹
                    {selectedRow.pending_receipt_amount?.toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex justify-between items-center">
                <div>
                  <p className="text-xs text-blue-700 font-semibold uppercase">
                    Total Receipts
                  </p>
                  <p className="text-lg font-bold text-blue-900 mt-1">
                    {(selectedRow.authorized_receipts || 0) +
                      (selectedRow.pending_receipts || 0)}{" "}
                    Receipts
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-blue-700 font-semibold uppercase">
                    Total Amount
                  </p>
                  <p className="text-lg font-bold text-blue-900 mt-1">
                    ₹
                    {(
                      (selectedRow.authorized_receipt_amount || 0) +
                      (selectedRow.pending_receipt_amount || 0)
                    ).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZonewiseReceiptDetails;
